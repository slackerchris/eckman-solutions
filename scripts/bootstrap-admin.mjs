import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.PORTAL_ADMIN_EMAIL?.toLowerCase();
  const password = process.env.PORTAL_ADMIN_PASSWORD;
  const name = process.env.PORTAL_ADMIN_NAME ?? "Portal Admin";

  if (!email || !password) {
    console.error(
      "BOOTSTRAP_ADMIN is enabled but PORTAL_ADMIN_EMAIL or PORTAL_ADMIN_PASSWORD is missing.",
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("PORTAL_ADMIN_PASSWORD must be at least 8 characters long.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Portal admin ready: ${user.email} (${user.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
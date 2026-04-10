import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getArgValue(flag) {
  const args = process.argv.slice(2);
  const index = args.indexOf(flag);

  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
}

async function main() {
  const email = getArgValue("--email")?.toLowerCase();
  const password = getArgValue("--password");
  const name = getArgValue("--name") ?? "Portal User";
  const role = (getArgValue("--role") ?? "CLIENT").toUpperCase();

  if (!email || !password) {
    console.error(
      "Usage: npm run user:create -- --email owner@example.com --password 'change-me-now' --name 'Owner Name' --role ADMIN",
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters long.");
    process.exit(1);
  }

  if (!["ADMIN", "CLIENT"].includes(role)) {
    console.error("Role must be ADMIN or CLIENT.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role,
    },
    create: {
      email,
      name,
      passwordHash,
      role,
    },
  });

  console.log(`Portal user ready: ${user.email} (${user.role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
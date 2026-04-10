import type { Metadata } from "next";
import { IBM_Plex_Mono, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eckman.solutions"),
  title: {
    default: "Eckman Solutions | Websites, Analytics, Apps, and Business Hardware",
    template: "%s | Eckman Solutions",
  },
  description:
    "Eckman Solutions builds practical digital systems for local businesses, from websites and analytics to web apps, custom software, and hardware support.",
  openGraph: {
    title: "Eckman Solutions",
    description:
      "Websites, analytics, custom software, and small business hardware solutions built for real-world operations.",
    url: "https://eckman.solutions",
    siteName: "Eckman Solutions",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eckman Solutions",
    description:
      "Digital systems for local businesses: analytics, websites, apps, custom software, and hardware solutions.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${plexMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)] antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { FadeObserver } from "@/components/fade-observer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
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
    images: [
      {
        url: "/brand/eckman-mark.svg",
        width: 120,
        height: 120,
        alt: "Eckman Solutions mark",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eckman Solutions",
    description:
      "Digital systems for local businesses: analytics, websites, apps, custom software, and hardware solutions.",
    images: ["/brand/eckman-mark.svg"],
  },
  icons: {
    icon: "/brand/eckman-mark.svg",
    shortcut: "/brand/eckman-mark.svg",
    apple: "/brand/eckman-mark.svg",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read theme cookie set by ThemeToggle so SSR and client agree → no hydration mismatch
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  // "system" and missing cookie both default to no attribute (let CSS/media query decide)
  const dataTheme = themeCookie === "dark" ? "dark" : themeCookie === "light" ? "light" : undefined;

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${sourceSerif.variable}`}
      data-theme={dataTheme}
      suppressHydrationWarning
    >
      <head>
        {/* Sync data-theme before paint for system-preference detection & instant switching */}
        <script dangerouslySetInnerHTML={{ __html: `
(function(){
  var s=localStorage.getItem('theme');
  var d=document.documentElement;
  if(s==='dark'||(s==='system'||!s)&&window.matchMedia('(prefers-color-scheme:dark)').matches){
    d.setAttribute('data-theme','dark');
  } else if(s==='light'){
    d.setAttribute('data-theme','light');
  }
})();
        `}} />
      </head>
      <body><FadeObserver />{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Big_Shoulders, DM_Mono, Host_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { Frame } from "@/components/Frame";
import { Loader } from "@/components/Loader";
import { PacketLayer } from "@/components/PacketLayer";
import { MotionRoot } from "@/engine/MotionRoot";

const display = Big_Shoulders({
  subsets: ["latin"],
  variable: "--f-display",
  display: "swap",
});
const text = Host_Grotesk({
  subsets: ["latin"],
  variable: "--f-text",
  display: "swap",
});
const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--f-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Sultan Mahmud, backend engineer",
    template: "%s - Sultan Mahmud",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: "Sultan Mahmud, backend engineer",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sultan Mahmud, backend engineer",
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0e12",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable} ${mono.variable}`}
    >
      <body>
        <a className="skip-link" href="#main">
          skip to content
        </a>
        <Loader />
        <MotionRoot />
        <PacketLayer />
        {children}
        <Frame />
      </body>
    </html>
  );
}

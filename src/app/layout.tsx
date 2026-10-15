import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Nav } from "@/components/layout/nav";
import { SquadProvider } from "@/components/providers/squad-provider";
import "./globals.css";

const head = Space_Grotesk({ variable: "--font-head", subsets: ["latin"] });
const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const code = JetBrains_Mono({ variable: "--font-code", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://theaigentz.com"),
  title: {
    default: "theaigentz — Hire specialist AI Aigentz",
    template: "%s · theaigentz",
  },
  description:
    "Stop prompting generalists. Hire Aigentz: autonomous AI specialists with real personalities, a shared brain, and a library of plug-in Skillz.",
  openGraph: {
    title: "theaigentz — Hire specialist AI Aigentz",
    description: "Autonomous AI specialists with real personalities. Build your squad in 3 minutes.",
    url: "https://theaigentz.com",
    siteName: "theaigentz",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0b16",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable} ${code.variable} antialiased`}>
      <body className="min-h-svh">
        <SquadProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </SquadProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import { GlassCursor } from "@/components/site/GlassCursor";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const displaySerif = Bodoni_Moda({
  variable: "--font-display-serif",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: { default: "Blue Bird — Innovation & security", template: "%s — Blue Bird" },
  description: "We are at the forefront of merging cutting-edge technology.",
};

export const viewport: Viewport = {
  themeColor: "#c5dce4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${displaySerif.variable} antialiased`}>
      <body className="min-h-svh">
        {children}
        <GlassCursor />
      </body>
    </html>
  );
}

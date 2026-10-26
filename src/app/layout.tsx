import type { Metadata } from "next";
import { Commissioner, Cormorant_Garamond } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navigation, SeasonRibbon } from "@/components/Navigation";
import { getCurrentSeason } from "@/lib/current-season";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: "500",
  variable: "--nf-display",
  display: "swap",
});

const sans = Commissioner({
  subsets: ["latin", "latin-ext"],
  variable: "--nf-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Euro Travel",
    template: "%s · Euro Travel",
  },
  description: "Slow journeys through Europe, in every season.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const season = await getCurrentSeason();

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="et" data-theme="light" data-season={season}>
        <a className="pg-skip" href="#main">
          Skip to content
        </a>
        <Navigation />
        <SeasonRibbon />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

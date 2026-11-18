import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnalyticsBeacon } from "../components/analytics-beacon";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Network for Active Citizens (NAC)",
    template: "%s | Network for Active Citizens",
  },
  description:
    "NAC is a network of youth organisations in Uganda building resilience through capability development and policy outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <AnalyticsBeacon />
      </body>
    </html>
  );
}

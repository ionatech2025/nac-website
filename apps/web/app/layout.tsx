import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { AnalyticsBeacon } from "../components/analytics-beacon";
import {
  DEFAULT_DESCRIPTION,
  rootMetadataBase,
  SITE_NAME,
} from "../lib/page-metadata";
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
  metadataBase: rootMetadataBase(),
  title: {
    default: `${SITE_NAME} (NAC)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_UG",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        {children}
        <AnalyticsBeacon />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Summit Bullion - Precious Metals for the Next Generation",
  description: "Clear prices and fast fulfillment for precious metals investing. Buy gold, silver, and other precious metals with flexible payment options including cryptocurrency. Competitive pricing, world-class service, and secure transactions.",
  keywords: [
    "precious metals",
    "gold",
    "silver", 
    "bullion",
    "cryptocurrency",
    "crypto",
    "investing",
    "portfolio diversification",
    "inflation protection",
    "physical assets",
    "fast shipping",
    "secure transactions",
    "competitive pricing"
  ],
  authors: [{ name: "Summit Bullion" }],
  creator: "Summit Bullion",
  publisher: "Summit Bullion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://summitbullion.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Summit Bullion - Precious Metals for the Next Generation",
    description: "Clear prices and fast fulfillment for precious metals investing. Buy gold, silver, and other precious metals with flexible payment options including cryptocurrency.",
    url: "https://summitbullion.com",
    siteName: "Summit Bullion",
    images: [
      {
        url: "/images/hero-image.png",
        width: 1200,
        height: 630,
        alt: "Summit Bullion - Precious Metals Investing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Summit Bullion - Precious Metals for the Next Generation",
    description: "Clear prices and fast fulfillment for precious metals investing. Buy gold, silver, and other precious metals with flexible payment options including cryptocurrency.",
    images: ["/images/hero-image.png"],
    creator: "@summitbullion",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffb546" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Summit Bullion" />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/images/icons/32.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/images/icons/16.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/images/icons/32.svg" />
        <link rel="icon" type="image/svg+xml" sizes="128x128" href="/images/icons/128.svg" />
        <link rel="icon" type="image/svg+xml" sizes="512x512" href="/images/icons/512.svg" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="128x128" href="/images/icons/128.svg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/images/icons/512.svg" />
        
        {/* Fallback favicon */}
        <link rel="shortcut icon" href="/images/icons/32.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#fcf8f1]`}
      >
        {children}
      </body>
    </html>
  );
}

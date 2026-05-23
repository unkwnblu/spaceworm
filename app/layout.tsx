import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://spaceworm.co";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Spaceworm — Premium Streetwear",
    template: "%s — Spaceworm",
  },
  description:
    "Spaceworm exists in the gap between streetwear and technical wear. Functional, durable, and relentlessly clean. Made in Nigeria.",
  keywords: [
    "streetwear",
    "Nigerian streetwear",
    "premium streetwear",
    "technical wear",
    "Spaceworm",
    "Lagos fashion",
    "minimalist fashion",
    "black and white clothing",
  ],
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  authors: [{ name: "Spaceworm" }],
  creator: "Spaceworm",
  publisher: "Spaceworm",
  formatDetection: {
    telephone: true,
    email: true,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Spaceworm",
    title: "Spaceworm — Premium Streetwear",
    description:
      "Functional, durable, and relentlessly clean. Built for those who move without noise.",
    url: BASE_URL,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spaceworm — Premium Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spaceworm — Premium Streetwear",
    description:
      "Functional, durable, and relentlessly clean. Built for those who move without noise.",
    images: ["/og-image.jpg"],
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
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { JsonLd } from "@/components/json-ld";
import { AgencyProvider } from "@/lib/agency-context";
import { ClientLayout } from "@/components/client-layout";

export const metadata: Metadata = {
  title: "Vishal Media Tech | Premier Digital Marketing & Web Development Agency",
  description:
    "Vishal Media Tech is a high-converting digital marketing and web development agency in India. We help businesses generate leads and revenue through Next.js websites, Meta Ads, Google PPC, and SEO.",
  keywords: [
    "Digital Marketing Agency",
    "Website Development",
    "Meta Ads Agency",
    "Google Ads PPC",
    "SEO Services India",
    "Vishal Media Tech",
    "Lead Generation Agency",
    "Landing Page Design",
    "WhatsApp Marketing Automation"
  ],
  authors: [{ name: "Vishal Media Tech" }],
  creator: "Vishal Media Tech",
  publisher: "Vishal Media Tech",
  metadataBase: new URL("https://vishalmediatech.com"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Vishal Media Tech | Digital Marketing & Web Development Agency",
    description:
      "Grow your business faster with digital marketing that actually delivers results. High-converting websites, Meta Ads, Google PPC, and dominant SEO.",
    url: "https://vishalmediatech.com",
    siteName: "Vishal Media Tech",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vishal Media Tech Digital Agency"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishal Media Tech | Digital Growth Agency",
    description:
      "High-ROAS Meta Ads, dominant SEO, and high-converting Next.js website development for growing businesses.",
    images: ["/og-image.jpg"],
    creator: "@vishalmediatech"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  themeColor: "#DC2626",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-600 selection:text-white">
        <AgencyProvider>
          <ClientLayout>{children}</ClientLayout>
        </AgencyProvider>
      </body>
    </html>
  );
}

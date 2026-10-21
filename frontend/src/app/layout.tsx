import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "PetCare - Gestion d'animaux de compagnie",
  description: "Prenez soin de vos animaux avec amour. Suivez leur sante, nutrition, vaccinations et rendez-vous.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PetCare",
  },
};

export const viewport: Viewport = {
  themeColor: "#2D7A4F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/icon-192x192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

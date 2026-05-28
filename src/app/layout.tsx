import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "EcoBridal Control",
  description: "Sistema interno para control de vestidos, modelos, fotografia e Instagram.",
  icons: {
    icon: "/logo-ecobridal.png",
    shortcut: "/logo-ecobridal.png",
    apple: "/logo-ecobridal.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

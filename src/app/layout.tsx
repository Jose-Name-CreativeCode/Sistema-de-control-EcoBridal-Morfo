import type { Metadata } from "next";
import "./globals.css";
import { logoutAction } from "@/app/login/actions";
import { AppShell } from "@/components/app-shell";
import { getCurrentSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "EcoBridal Control",
  description: "Sistema interno para control de vestidos, modelos, fotografia e Instagram.",
  icons: {
    icon: "/logo-ecobridal.png?v=morfo",
    shortcut: "/logo-ecobridal.png?v=morfo",
    apple: "/logo-ecobridal.png?v=morfo",
  },
};

function getDisplayName(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === "manolonat17@gmail.com") {
    return "Jose";
  }

  if (normalizedEmail === "verogr2000@gmail.com") {
    return "Vero";
  }

  return email;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getCurrentSession();

  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full">
        <AppShell
          authSlot={
            session ? (
              <div className="flex items-center gap-2">
                <span className="hidden rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/78 lg:inline-flex">
                  {getDisplayName(session.email)}
                </span>
                <form action={logoutAction}>
                  <button type="submit" className="app-button-secondary px-3 py-2">
                    Salir
                  </button>
                </form>
              </div>
            ) : null
          }
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}

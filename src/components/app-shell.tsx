"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Dashboard" },
  { href: "/vestidos", label: "Vestidos" },
  { href: "/vestidos/nuevo", label: "Nuevo vestido" },
  { href: "/modelos", label: "Modelos" },
  { href: "/poses", label: "Poses" },
];

function getActiveHref(pathname: string) {
  const matches = navigation
    .map((item) => item.href)
    .filter((href) => {
      if (href === "/") {
        return pathname === "/";
      }

      return pathname === href || pathname.startsWith(`${href}/`);
    })
    .sort((left, right) => right.length - left.length);

  return matches[0] ?? "/";
}

function isActive(activeHref: string, href: string) {
  if (href === "/") {
    return activeHref === "/";
  }

  return activeHref === href;
}

export function AppShell({
  children,
  authSlot,
}: {
  children: React.ReactNode;
  authSlot?: React.ReactNode;
}) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);
  const isLoginPage = pathname === "/login";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoginPage) {
    return <div className="min-h-screen bg-transparent">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-3 px-2.5 py-2.5 sm:gap-4 sm:px-4 sm:py-4 xl:px-6 xl:py-6">
        <aside className="app-shell-panel sticky top-2.5 z-40 w-full shrink-0 overflow-hidden bg-[linear-gradient(180deg,rgba(36,39,45,0.98),rgba(31,34,40,0.98))] px-2.5 py-2.5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)] sm:top-3 sm:px-4 sm:py-3 lg:px-5 lg:py-3.5">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-center rounded-xl bg-[rgba(250,248,244,0.96)] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.14)] sm:rounded-2xl sm:px-4 sm:py-2"
            >
              <Image
                src="/logo-ecobridal.png"
                alt="Logo EcoBridal"
                width={132}
                height={44}
                className="h-9 w-auto object-contain sm:h-11"
                priority
              />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((current) => !current)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white/90 transition hover:bg-white/10"
            >
              <span className="flex flex-col gap-1.5">
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition ${
                    mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`block h-0.5 w-5 rounded-full bg-current transition ${
                    mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          {mobileMenuOpen ? (
            <div className="mt-3 grid gap-3 rounded-[22px] border border-white/8 bg-white/4 p-3 lg:hidden">
              <nav className="grid gap-2">
                {navigation.map((item) => {
                  const active = isActive(activeHref, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-[rgba(87,131,208,0.22)] bg-[rgba(250,248,244,0.98)] text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                          : "border-white/8 bg-white/5 text-white/86 hover:border-[rgba(88,190,193,0.24)] hover:bg-white/9"
                      }`}
                    >
                      <span
                        className={`text-[0.95rem] font-semibold ${
                          active ? "text-foreground" : "text-white/86"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {authSlot ? <div className="border-t border-white/8 pt-3">{authSlot}</div> : null}
            </div>
          ) : null}

          <div className="hidden flex-col gap-2.5 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <div className="flex justify-center lg:min-w-[180px] lg:justify-start">
              <Link
                href="/"
                className="inline-flex items-center rounded-xl bg-[rgba(250,248,244,0.96)] px-3 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.14)] sm:rounded-2xl sm:px-4 sm:py-2"
              >
                <Image
                  src="/logo-ecobridal.png"
                  alt="Logo EcoBridal"
                  width={132}
                  height={44}
                  className="h-9 w-auto object-contain sm:h-11"
                  priority
                />
              </Link>
            </div>

            <nav className="flex flex-1 items-center justify-start lg:justify-center">
              <div className="flex max-w-full items-center justify-start gap-1.5 overflow-x-auto px-0.5 pb-1 lg:justify-center lg:gap-2">
                {navigation.map((item) => {
                  const active = isActive(activeHref, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`min-w-fit whitespace-nowrap rounded-full border px-3 py-2 text-center transition sm:px-4 sm:py-2.5 ${
                        active
                          ? "border-[rgba(87,131,208,0.22)] bg-[rgba(250,248,244,0.98)] text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                          : "border-white/8 bg-white/5 text-white/86 hover:border-[rgba(88,190,193,0.24)] hover:bg-white/9"
                      }`}
                    >
                      <span
                        className={`text-[0.82rem] font-semibold sm:text-[0.95rem] ${
                          active ? "text-foreground" : "text-white/86"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="flex justify-center lg:min-w-[180px] lg:justify-end">
              {authSlot ?? <div className="hidden lg:block lg:min-w-[180px]" />}
            </div>
          </div>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

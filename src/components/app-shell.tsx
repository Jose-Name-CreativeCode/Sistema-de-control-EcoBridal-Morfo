"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeHref = getActiveHref(pathname);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 xl:px-6 xl:py-6">
        <aside className="app-shell-panel sticky top-3 z-40 w-full shrink-0 overflow-hidden bg-[linear-gradient(180deg,rgba(36,39,45,0.98),rgba(31,34,40,0.98))] px-3 py-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.2)] sm:px-4 lg:px-5 lg:py-3.5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex justify-center lg:min-w-[180px] lg:justify-start">
              <p className="text-xs font-semibold tracking-[0.32em] text-white/68">
                ECOBRIDAL
              </p>
            </div>

            <nav className="flex flex-1 items-center justify-center">
              <div className="flex max-w-full items-center justify-center gap-2 overflow-x-auto pb-1">
                {navigation.map((item) => {
                  const active = isActive(activeHref, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`min-w-fit whitespace-nowrap rounded-full border px-4 py-2.5 text-center transition ${
                        active
                          ? "border-[rgba(87,131,208,0.22)] bg-[rgba(250,248,244,0.98)] text-foreground shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
                          : "border-white/8 bg-white/5 text-white/86 hover:border-[rgba(88,190,193,0.24)] hover:bg-white/9"
                      }`}
                    >
                      <span
                        className={`text-sm font-semibold sm:text-[0.95rem] ${
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

            <div className="hidden lg:block lg:min-w-[180px]" />
          </div>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

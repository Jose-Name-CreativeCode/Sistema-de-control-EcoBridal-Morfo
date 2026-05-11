"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { href: "/", label: "Dashboard", note: "Resumen diario" },
  { href: "/vestidos", label: "Vestidos", note: "Catálogo y filtros" },
  { href: "/vestidos/nuevo", label: "Nuevo vestido", note: "Alta rápida" },
  { href: "/modelos", label: "Modelos", note: "Perfiles y tallas" },
  { href: "/asignaciones", label: "Asignaciones", note: "Sesiones y cruces" },
  { href: "/poses", label: "Poses", note: "Referencia por talla" },
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
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col gap-4 px-3 py-3 sm:px-4 sm:py-4 2xl:flex-row 2xl:gap-6 2xl:px-6 2xl:py-6">
        <aside className="app-shell-panel flex w-full shrink-0 flex-col p-4 text-white 2xl:sticky 2xl:top-3 2xl:h-[calc(100vh-1.5rem)] 2xl:w-[320px] 2xl:overflow-hidden 2xl:p-5">
          <div className="border-b border-white/14 pb-4 2xl:pb-5">
            <p className="text-xs uppercase tracking-[0.28em] text-white/70">
              EcoBridal Hub
            </p>
            <h2 className="mt-3 font-heading text-3xl leading-none text-white sm:text-4xl">
              Navegación central
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/74 2xl:max-w-none">
              Entra a cada módulo, captura datos y vuelve aquí cuando necesites
              cambiar de contexto.
            </p>
          </div>

          <nav className="mt-4 flex gap-3 overflow-x-auto pb-1 2xl:mt-5 2xl:grid 2xl:flex-1 2xl:content-start 2xl:overflow-y-auto 2xl:pb-0 2xl:pr-1">
            {navigation.map((item) => {
              const active = isActive(activeHref, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`min-w-[176px] rounded-2xl border px-4 py-3 transition 2xl:min-w-0 2xl:py-4 ${
                    active
                      ? "border-white/12 bg-white text-foreground shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
                      : "border-white/10 bg-white/6 text-white hover:border-accent hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`text-base font-semibold ${
                        active ? "text-foreground" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-sm leading-6 ${
                      active ? "text-foreground/70" : "text-white/72"
                    }`}
                  >
                    {item.note}
                  </p>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { DashboardReminders } from "@/components/dashboard-reminders";
import { getDashboardData } from "@/lib/dashboard";

export default async function Home() {
  const dashboard = await getDashboardData();

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">Inicio</p>
            <h1 className="mt-3 font-heading text-4xl leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">
              Panel simple del estudio
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8">
              Aquí solo ves lo importante y cada bloque te lleva directo a donde sí se
              modifica la información.
            </p>
          </div>

          <div className="app-badge border border-line bg-white text-accent-strong">
            {dashboard.databaseReady ? "Base real activa" : "Modo demo"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboard.metrics.map((card) => (
            <article key={card.label} className="app-card p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                {card.label}
              </p>
              <p className="mt-3 font-heading text-4xl leading-none text-accent-strong sm:text-5xl">
                {card.value}
              </p>
              <p className="mt-3 text-sm leading-7 text-foreground/72">{card.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="app-page">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Accesos directos
            </p>
            <h2 className="mt-2 font-heading text-3xl leading-none text-foreground sm:text-4xl">
              Qué quieres hacer
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link href="/vestidos" className="app-card-soft p-5 transition hover:border-accent">
              <p className="font-heading text-xl leading-none sm:text-2xl">Ver vestidos</p>
              <p className="mt-3 text-sm leading-7 text-foreground/72">
                Buscar, filtrar y abrir cualquier vestido del catálogo.
              </p>
            </Link>

            <Link
              href="/vestidos/nuevo"
              className="app-card-soft p-5 transition hover:border-accent"
            >
              <p className="font-heading text-xl leading-none sm:text-2xl">Registrar vestido</p>
              <p className="mt-3 text-sm leading-7 text-foreground/72">
                Dar de alta un vestido nuevo con sus datos básicos.
              </p>
            </Link>

            <Link href="/modelos" className="app-card-soft p-5 transition hover:border-accent">
              <p className="font-heading text-xl leading-none sm:text-2xl">Ver modelos</p>
              <p className="mt-3 text-sm leading-7 text-foreground/72">
                Revisar perfiles, tallas y disponibilidad de modelos.
              </p>
            </Link>

            <Link
              href="/asignaciones"
              className="app-card-soft p-5 transition hover:border-accent"
            >
              <p className="font-heading text-xl leading-none sm:text-2xl">Revisar asignaciones</p>
              <p className="mt-3 text-sm leading-7 text-foreground/72">
                Ver cruces de vestido y modelo para sesiones.
              </p>
            </Link>

            <Link href="/poses" className="app-card-soft p-5 transition hover:border-accent">
              <p className="font-heading text-xl leading-none sm:text-2xl">Ver poses</p>
              <p className="mt-3 text-sm leading-7 text-foreground/72">
                Visualizar referencias de poses por talla de modelo.
              </p>
            </Link>
          </div>
        </article>

        <article className="app-page">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Cómo usarlo
            </p>
            <h2 className="mt-2 font-heading text-3xl leading-none text-foreground sm:text-4xl">
              Flujo corto
            </h2>
          </div>

          <div className="mt-6 grid gap-4">
            {[
              "1. Registra el vestido.",
              "2. Abre su detalle.",
              "3. Agrega fotos, carpeta e Instagram.",
              "4. Cambia estados y asigna modelo si hace falta.",
            ].map((step) => (
              <div key={step} className="app-card-soft p-5 text-sm leading-7 text-foreground/78">
                {step}
              </div>
            ))}
          </div>
        </article>
      </section>

      <DashboardReminders />
    </main>
  );
}

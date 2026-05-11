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
      <DashboardReminders />
    </main>
  );
}

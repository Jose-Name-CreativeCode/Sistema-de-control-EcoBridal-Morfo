import Link from "next/link";
import { saveDashboardLinkAction } from "@/app/dashboard-actions";
import { DashboardReminders } from "@/components/dashboard-reminders";
import { getDashboardData } from "@/lib/dashboard";

function formatDate(value: Date | null) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

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
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.metrics.map((card) => (
            <article key={card.label} className="app-card min-h-[10.5rem] p-5">
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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="app-card p-5">
            <div className="border-b border-line pb-4">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                Citas programadas
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
                Modelo y vestido
              </h2>
            </div>

            <div className="mt-5 grid gap-3">
              {dashboard.upcomingAssignments.length > 0 ? (
                dashboard.upcomingAssignments.map((assignment) => (
                  <Link
                    key={`${assignment.dressId}-${assignment.modelName}-${assignment.scheduledDate?.toISOString() ?? "sin-fecha"}`}
                    href={assignment.href}
                    className="rounded-[1.15rem] border border-line bg-[rgba(250,248,244,0.98)] px-4 py-4 transition hover:border-accent hover:bg-white"
                  >
                    <p className="font-medium text-foreground">{assignment.modelName}</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/72">
                      {assignment.dressName} · {formatDate(assignment.scheduledDate)}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.15rem] border border-dashed border-line bg-[rgba(250,248,244,0.88)] px-4 py-5 text-sm text-foreground/72">
                  Todavía no hay citas programadas para toma de fotos.
                </div>
              )}
            </div>
          </article>

          <article className="app-card p-5">
            <div className="border-b border-line pb-4">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                Pendientes de Instagram
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
                Publicaciones pendientes
              </h2>
            </div>

            <div className="mt-5 grid max-h-[28rem] gap-3 overflow-y-auto pr-1">
              {dashboard.publicationQueue.length > 0 ? (
                dashboard.publicationQueue.map((task) => (
                  <Link
                    key={task.href}
                    href={task.href}
                    className="rounded-[1.15rem] border border-line bg-[rgba(250,248,244,0.98)] px-4 py-4 transition hover:border-accent hover:bg-white"
                  >
                    <p className="font-medium text-foreground">{task.title}</p>
                    <p className="mt-1 text-sm leading-6 text-foreground/72">{task.subtitle}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.15rem] border border-dashed border-line bg-[rgba(250,248,244,0.88)] px-4 py-5 text-sm text-foreground/72">
                  No hay vestidos pendientes de publicación.
                </div>
              )}
            </div>
          </article>
        </div>

        <div className="mt-8">
          <article className="app-card p-5">
            <div className="border-b border-line pb-4">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                Links rápidos
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
                Exceles compartidos
              </h2>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {dashboard.excelLinks.map((item) => (
                <div
                  key={item.key}
                  className="rounded-[1.2rem] border border-line bg-[rgba(250,248,244,0.98)] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-foreground">{item.label}</p>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="app-button-primary px-4 py-2"
                      >
                        Abrir
                      </a>
                    ) : (
                      <span className="app-badge bg-slate-200 text-slate-700">
                        Sin link
                      </span>
                    )}
                  </div>

                  <form action={saveDashboardLinkAction} className="mt-4 grid gap-3">
                    <input type="hidden" name="key" value={item.key} />
                    <input type="hidden" name="label" value={item.label} />
                    <label className="grid gap-2 text-sm text-foreground/75">
                      Link del Excel
                      <input
                        type="url"
                        name="url"
                        defaultValue={item.url}
                        placeholder="https://..."
                        className="app-field"
                      />
                    </label>
                    <button type="submit" className="app-button-secondary w-full sm:w-auto">
                      Guardar link
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
      <DashboardReminders />
    </main>
  );
}

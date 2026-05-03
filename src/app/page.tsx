import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";

const workflowSteps = [
  "Registrar vestido con nombre, marca, talla y notas mínimas.",
  "Asignar modelo compatible y dejar costo de sesión o por vestido.",
  "Subir evidencia interna para frente, espalda, detalle y video.",
  "Pegar la carpeta editada de OneDrive u Outlook cuando esté lista.",
  "Guardar el link del post o reel para comprobar la publicación.",
];

export default async function Home() {
  const dashboard = await getDashboardData();

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">
                  EcoBridal Morfo
                </p>
                <h1 className="mt-3 font-heading text-5xl leading-[0.95] text-foreground sm:text-6xl">
                  Centro de control del estudio
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/78">
                  Desde aquí puedes revisar qué vestidos siguen pendientes, qué recursos
                  faltan y qué publicaciones necesitan prueba o seguimiento.
                </p>
              </div>

              <div className="app-badge border border-line bg-white text-accent-strong">
                {dashboard.databaseReady ? "Base real activa" : "Modo demo"}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {dashboard.metrics.map((card) => (
                <article key={card.label} className="app-card h-full p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                    {card.label}
                  </p>
                  <p className="mt-3 font-heading text-5xl leading-none text-accent-strong">
                    {card.value}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-foreground/72">{card.note}</p>
                </article>
              ))}
            </div>

          </div>

          <aside className="rounded-[24px] bg-[linear-gradient(180deg,#3f6fc6_0%,#48c0c1_100%)] p-6 text-white shadow-[0_18px_50px_rgba(17,30,59,0.24)]">
            <p className="text-sm uppercase tracking-[0.28em] text-white/72">
              Flujo recomendado
            </p>
            <ol className="mt-6 grid gap-4">
              {workflowSteps.map((step, index) => (
                <li
                  key={step}
                  className="grid grid-cols-[64px_1fr] gap-4 rounded-2xl border border-white/10 bg-white/10 p-4"
                >
                  <span className="font-heading text-4xl leading-none text-white/88">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-7 text-white/88">{step}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="app-page">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Pendientes críticos
            </p>
            <h2 className="mt-2 font-heading text-4xl leading-none text-foreground">
              Qué mover hoy
            </h2>
          </div>

          <div className="mt-6 grid gap-4">
            {dashboard.urgentTasks.map((task) => (
              <Link
                key={`${task.href}-${task.title}`}
                href={task.href}
                className="app-card-soft p-5 transition hover:border-accent-strong hover:bg-accent-strong hover:text-white"
              >
                <p className="font-heading text-2xl leading-none">{task.title}</p>
                <p className="mt-3 text-sm leading-7 opacity-80">{task.subtitle}</p>
              </Link>
            ))}
            {dashboard.urgentTasks.length === 0 ? (
              <div className="app-card-soft p-5 text-sm text-foreground/72">
                No hay tareas urgentes en este momento.
              </div>
            ) : null}
          </div>
        </article>

        <article className="app-page">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Publicación pendiente
            </p>
            <h2 className="mt-2 font-heading text-4xl leading-none text-foreground">
              Cola de Instagram
            </h2>
          </div>

          <div className="mt-6 grid gap-4">
            {dashboard.publicationQueue.map((task) => (
              <Link
                key={`${task.href}-${task.title}`}
                href={task.href}
                className="app-card-soft p-5 transition hover:border-support-coral hover:bg-support-coral hover:text-white"
              >
                <p className="font-heading text-2xl leading-none">{task.title}</p>
                <p className="mt-3 text-sm leading-7 opacity-80">{task.subtitle}</p>
              </Link>
            ))}
            {dashboard.publicationQueue.length === 0 ? (
              <div className="app-card-soft p-5 text-sm text-foreground/72">
                No hay vestidos esperando publicación.
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="app-page">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Recursos faltantes
            </p>
            <h2 className="mt-2 font-heading text-4xl leading-none text-foreground">
              Carpetas y evidencia
            </h2>
          </div>

          <div className="mt-6 grid gap-4">
            {dashboard.missingAssets.map((task) => (
              <Link
                key={`${task.href}-${task.title}`}
                href={task.href}
                className="app-card-soft p-5 transition hover:border-accent-soft hover:bg-accent-soft hover:text-white"
              >
                <p className="font-heading text-2xl leading-none">{task.title}</p>
                <p className="mt-3 text-sm leading-7 opacity-80">{task.subtitle}</p>
              </Link>
            ))}
            {dashboard.missingAssets.length === 0 ? (
              <div className="app-card-soft p-5 text-sm text-foreground/72">
                No hay carpetas externas pendientes por registrar.
              </div>
            ) : null}
          </div>
        </article>

        <article className="app-page">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Próximas sesiones
            </p>
            <h2 className="mt-2 font-heading text-4xl leading-none text-foreground">
              Asignaciones en curso
            </h2>
          </div>

          <div className="mt-6 grid gap-4">
            {dashboard.upcomingAssignments.map((assignment, index) => (
              <div
                key={`${assignment.dressName}-${assignment.modelName}-${index}`}
                className="app-card h-full p-5"
              >
                <p className="font-heading text-2xl leading-none text-foreground">
                  {assignment.dressName}
                </p>
                <div className="mt-4 grid gap-2 text-sm leading-7 text-foreground/74">
                  <p>Modelo: {assignment.modelName}</p>
                  <p>Estado: {assignment.status}</p>
                  <p>
                    Fecha:{" "}
                    {assignment.scheduledDate
                      ? new Intl.DateTimeFormat("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(assignment.scheduledDate)
                      : "Sin programar"}
                  </p>
                </div>
              </div>
            ))}
            {dashboard.upcomingAssignments.length === 0 ? (
              <div className="app-card p-5 text-sm text-foreground/72">
                No hay asignaciones programadas todavía.
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}

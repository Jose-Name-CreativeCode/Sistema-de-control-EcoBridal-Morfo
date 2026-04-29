import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";

const workflowSteps = [
  "Registrar vestido con marca, talla, estado y notas.",
  "Asignar modelo compatible y guardar costo por vestido u hora.",
  "Subir fotos de referencia al sistema.",
  "Pegar el link de la carpeta editada en Outlook o OneDrive.",
  "Guardar el link del post o reel de Instagram para comprobar la publicacion.",
];

export default async function Home() {
  const dashboard = await getDashboardData();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_20px_80px_rgba(64,34,24,0.08)]">
        <div className="grid gap-10 px-6 py-8 sm:px-10 lg:grid-cols-[1.3fr_0.7fr] lg:px-12 lg:py-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-accent">
                  EcoBridal Morfo
                </p>
                <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
                  Dashboard operativo del estudio.
                </h1>
              </div>
              <div className="hidden rounded-full border border-line bg-white/70 px-4 py-2 text-sm text-foreground/70 md:block">
                {dashboard.databaseReady ? "Conectado a base real" : "Modo demo"}
              </div>
            </div>

            <p className="max-w-2xl text-lg leading-8 text-foreground/78">
              Aquí ves qué vestidos faltan por fotografiar, cuáles ya requieren carpeta
              editada, qué publicaciones siguen pendientes y qué asignaciones necesitan
              seguimiento. Es la vista para arrancar el día sin perder contexto.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {dashboard.metrics.map((card) => (
                <article
                  key={card.label}
                  className="rounded-[1.5rem] border border-line bg-white/80 p-5"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                    {card.label}
                  </p>
                  <p className="mt-3 font-heading text-5xl text-accent">{card.value}</p>
                  <p className="mt-2 text-sm text-foreground/70">{card.note}</p>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vestidos"
                className="rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-[#6f3b28]"
              >
                Abrir módulo de vestidos
              </Link>
              <Link
                href="/vestidos/nuevo"
                className="rounded-full border border-line bg-white px-6 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
              >
                Registrar nuevo vestido
              </Link>
              <Link
                href="/modelos"
                className="rounded-full border border-line bg-white px-6 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
              >
                Abrir modelos
              </Link>
              <Link
                href="/asignaciones"
                className="rounded-full border border-line bg-white px-6 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
              >
                Ver asignaciones
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(141,75,50,0.96),rgba(81,38,26,0.96))] p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Flujo de trabajo
            </p>
            <ol className="mt-6 space-y-4">
              {workflowSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-4 border-b border-white/15 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="font-heading text-4xl leading-none text-accent-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-7 text-white/85">{step}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-line bg-white/75 p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
                Pendientes críticos
              </p>
              <h2 className="font-heading text-4xl text-foreground">
                Qué atacar primero
              </h2>
            </div>
            <span className="rounded-full bg-accent px-4 py-2 text-sm text-white">Hoy</span>
          </div>

          <div className="mt-6 grid gap-4">
            {dashboard.urgentTasks.map((task) => (
              <Link
                key={`${task.href}-${task.title}`}
                href={task.href}
                className="rounded-[1.25rem] bg-background p-5 transition hover:bg-white"
              >
                <p className="font-heading text-2xl text-foreground">{task.title}</p>
                <p className="mt-2 text-sm leading-7 text-foreground/72">{task.subtitle}</p>
              </Link>
            ))}
            {dashboard.urgentTasks.length === 0 ? (
              <div className="rounded-[1.25rem] bg-background p-5 text-sm text-foreground/72">
                No hay tareas urgentes en este momento.
              </div>
            ) : null}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-line bg-surface-strong p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
            Publicación pendiente
          </p>
          <h2 className="mt-2 font-heading text-4xl text-foreground">
            Cola de Instagram
          </h2>
          <div className="mt-6 grid gap-4">
            {dashboard.publicationQueue.map((task) => (
              <Link
                key={`${task.href}-${task.title}`}
                href={task.href}
                className="rounded-[1.25rem] border border-foreground/10 bg-white/80 px-4 py-4 transition hover:bg-white"
              >
                <p className="font-heading text-2xl text-foreground">{task.title}</p>
                <p className="mt-2 text-sm leading-7 text-foreground/72">{task.subtitle}</p>
              </Link>
            ))}
            {dashboard.publicationQueue.length === 0 ? (
              <div className="rounded-[1.25rem] border border-foreground/10 bg-white/80 px-4 py-4 text-sm text-foreground/72">
                No hay vestidos esperando publicación.
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[1.75rem] border border-line bg-white/75 p-6">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Recursos faltantes
            </p>
            <h2 className="font-heading text-4xl text-foreground">Carpetas y evidencia</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {dashboard.missingAssets.map((task) => (
              <Link
                key={`${task.href}-${task.title}`}
                href={task.href}
                className="rounded-[1.25rem] bg-background p-5 transition hover:bg-white"
              >
                <p className="font-heading text-2xl text-foreground">{task.title}</p>
                <p className="mt-2 text-sm leading-7 text-foreground/72">{task.subtitle}</p>
              </Link>
            ))}
            {dashboard.missingAssets.length === 0 ? (
              <div className="rounded-[1.25rem] bg-background p-5 text-sm text-foreground/72">
                No hay carpetas externas pendientes por registrar.
              </div>
            ) : null}
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-line bg-surface p-6 shadow-[0_10px_30px_rgba(64,34,24,0.05)]">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Próximas sesiones
            </p>
            <h2 className="font-heading text-4xl text-foreground">Asignaciones en curso</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {dashboard.upcomingAssignments.map((assignment, index) => (
              <div
                key={`${assignment.dressName}-${assignment.modelName}-${index}`}
                className="rounded-[1.25rem] border border-line bg-white/80 p-5"
              >
                <p className="font-heading text-2xl text-foreground">{assignment.dressName}</p>
                <p className="mt-2 text-sm leading-7 text-foreground/72">
                  Modelo: {assignment.modelName}
                </p>
                <p className="text-sm leading-7 text-foreground/72">
                  Estado: {assignment.status}
                </p>
                <p className="text-sm leading-7 text-foreground/72">
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
            ))}
            {dashboard.upcomingAssignments.length === 0 ? (
              <div className="rounded-[1.25rem] border border-line bg-white/80 p-5 text-sm text-foreground/72">
                No hay asignaciones programadas todavía.
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}

import Link from "next/link";
import {
  removeDashboardAssignmentAction,
  saveDashboardInstagramPostAction,
  saveDashboardLinkAction,
  updateDashboardDressWorkflowAction,
  updateDashboardAssignmentAction,
} from "@/app/dashboard-actions";
import { DashboardReminders } from "@/components/dashboard-reminders";
import { getDashboardData } from "@/lib/dashboard";
import { assignmentStatusLabels } from "@/lib/models";

function formatDate(value: Date | null) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatDateInput(value: Date | null) {
  if (!value) return "";

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function DashboardOperationalList({
  items,
  emptyLabel,
}: {
  items: Array<{
    id: string;
    title: string;
    subtitle: string;
    href: string;
  }>;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.15rem] border border-dashed border-line bg-[rgba(250,248,244,0.88)] px-4 py-5 text-sm text-foreground/72">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="rounded-[1.15rem] border border-line bg-[rgba(250,248,244,0.98)] px-4 py-4 transition hover:border-accent hover:bg-white"
        >
          <p className="font-medium text-foreground">{item.title}</p>
          <p className="mt-1 text-sm leading-6 text-foreground/72">
            {item.subtitle}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default async function Home() {
  const dashboard = await getDashboardData();

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">
              Inicio
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">
              Panel simple del estudio
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8">
              Aquí solo ves lo importante y cada bloque te lleva directo a donde
              sí se modifica la información.
            </p>
          </div>

          <a
            href="https://morfo-hub.vercel.app/dashboard.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[12rem] w-full max-w-[20rem] items-center justify-center rounded-[1.8rem] border border-line bg-[rgba(250,248,244,0.98)] p-6 transition hover:border-accent hover:bg-white lg:min-h-[13rem]"
          >
            <img
              src="/logo-ecobridal.png"
              alt="Ir a Morfo Hub"
              className="max-h-[4.5rem] w-auto object-contain sm:max-h-[5.5rem]"
            />
          </a>
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
              <p className="mt-3 text-sm leading-7 text-foreground/72">
                {card.note}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <article className="app-card p-5">
            <div className="border-b border-line pb-4">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                Trabajo por tiempo
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
                Sesiones de hoy y semana
              </h2>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="grid gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Hoy
                </p>
                <DashboardOperationalList
                  items={dashboard.todayAssignments.map((assignment) => ({
                    id: assignment.id,
                    title: `${assignment.modelName} · ${assignment.dressName}`,
                    subtitle: formatDate(assignment.scheduledDate),
                    href: assignment.href,
                  }))}
                  emptyLabel="No hay sesiones programadas para hoy."
                />
              </div>

              <div className="grid gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Esta semana
                </p>
                <DashboardOperationalList
                  items={dashboard.weekAssignments.map((assignment) => ({
                    id: assignment.id,
                    title: `${assignment.modelName} · ${assignment.dressName}`,
                    subtitle: formatDate(assignment.scheduledDate),
                    href: assignment.href,
                  }))}
                  emptyLabel="No hay sesiones programadas esta semana."
                />
              </div>
            </div>
          </article>

          <article className="app-card p-5">
            <div className="border-b border-line pb-4">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                Producción inmediata
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
                Listos para avanzar
              </h2>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="grid max-h-[24rem] gap-3 overflow-y-auto pr-1">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Listos para editar
                </p>
                <DashboardOperationalList
                  items={dashboard.readyToEdit}
                  emptyLabel="Todavía no hay vestidos listos para editar."
                />
              </div>

              <div className="grid max-h-[24rem] gap-3 overflow-y-auto pr-1">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Listos para publicar
                </p>
                <DashboardOperationalList
                  items={dashboard.readyToPublish}
                  emptyLabel="Todavía no hay vestidos listos para publicar."
                />
              </div>
            </div>
          </article>
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
                  <div
                    key={assignment.id}
                    className="rounded-[1.15rem] border border-line bg-[rgba(250,248,244,0.98)] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-foreground">
                          {assignment.modelName}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-foreground/72">
                          {assignment.dressName} ·{" "}
                          {formatDate(assignment.scheduledDate)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground/55">
                          {assignmentStatusLabels[assignment.assignmentStatus]}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-foreground/68">
                          {assignment.notes ?? "Sin notas de asignación"}
                        </p>
                      </div>

                      <Link
                        href={assignment.href}
                        className="app-button-secondary px-4 py-2"
                      >
                        Ver vestido
                      </Link>
                    </div>

                    <details className="mt-4 rounded-[1rem] border border-line bg-white/70 px-4 py-3">
                      <summary className="cursor-pointer list-none text-sm font-medium text-accent">
                        Editar cita
                      </summary>

                      <form
                        action={updateDashboardAssignmentAction}
                        className="mt-4 grid gap-3"
                      >
                        <input
                          type="hidden"
                          name="assignmentId"
                          value={assignment.id}
                        />

                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-2 text-sm text-foreground/75">
                            Estado
                            <select
                              name="assignmentStatus"
                              defaultValue={assignment.assignmentStatus}
                              className="app-field"
                            >
                              <option value="CONFIRMED">Programada</option>
                              <option value="SUGGESTED">Pendiente</option>
                              <option value="CANCELLED">Cancelada</option>
                              <option value="COMPLETED">En espera</option>
                            </select>
                          </label>

                          <label className="grid gap-2 text-sm text-foreground/75">
                            Fecha programada
                            <input
                              type="date"
                              name="scheduledDate"
                              defaultValue={formatDateInput(
                                assignment.scheduledDate,
                              )}
                              className="app-field"
                            />
                          </label>
                        </div>

                        <label className="grid gap-2 text-sm text-foreground/75">
                          Notas
                          <textarea
                            name="notes"
                            rows={3}
                            defaultValue={assignment.notes ?? ""}
                            placeholder="Ajustes de horario, cambios o comentarios."
                            className="app-field min-h-28 resize-y"
                          />
                        </label>

                        <div className="flex flex-wrap gap-3">
                          <button
                            type="submit"
                            className="app-button-primary w-full sm:w-auto"
                          >
                            Guardar cambios
                          </button>
                        </div>
                      </form>

                      <form
                        action={removeDashboardAssignmentAction}
                        className="mt-3"
                      >
                        <input
                          type="hidden"
                          name="assignmentId"
                          value={assignment.id}
                        />
                        <button
                          type="submit"
                          className="rounded-xl border border-support-coral/30 px-4 py-3 text-sm font-medium text-support-coral transition hover:bg-support-coral hover:text-white"
                        >
                          Quitar cita
                        </button>
                      </form>
                    </details>
                  </div>
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
                  <div
                    key={task.href}
                    className="rounded-[1.15rem] border border-line bg-[rgba(250,248,244,0.98)] px-4 py-4"
                  >
                    <Link
                      href={task.href}
                      className="block transition hover:text-accent"
                    >
                      <p className="font-medium text-foreground">{task.title}</p>
                      <p className="mt-1 text-sm leading-6 text-foreground/72">
                        {task.subtitle}
                      </p>
                    </Link>

                    <details className="mt-4 rounded-[1rem] border border-line bg-white/70 px-4 py-3">
                      <summary className="cursor-pointer list-none text-sm font-medium text-accent">
                        Registrar publicación rápida
                      </summary>

                      <form
                        action={saveDashboardInstagramPostAction}
                        className="mt-4 grid gap-3"
                      >
                        <input
                          type="hidden"
                          name="dressId"
                          value={task.href.split("/")[2]?.split("?")[0] ?? ""}
                        />
                        <label className="grid gap-2 text-sm text-foreground/75">
                          Link de Instagram
                          <input
                            type="url"
                            name="instagramUrl"
                            required
                            placeholder="https://instagram.com/..."
                            className="app-field"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="grid gap-2 text-sm text-foreground/75">
                            Cuenta
                            <input
                              name="accountName"
                              placeholder="@ecobridalmorfo"
                              className="app-field"
                            />
                          </label>
                          <label className="grid gap-2 text-sm text-foreground/75">
                            Fecha
                            <input
                              type="date"
                              name="publishedAt"
                              className="app-field"
                            />
                          </label>
                        </div>
                        <label className="grid gap-2 text-sm text-foreground/75">
                          Notas
                          <input
                            name="captionNotes"
                            placeholder="Comentario interno o caption"
                            className="app-field"
                          />
                        </label>
                        <button
                          type="submit"
                          className="app-button-primary w-full sm:w-auto"
                        >
                          Guardar publicación
                        </button>
                      </form>
                    </details>
                  </div>
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
                Pendientes reales
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
                Bandeja operativa
              </h2>
            </div>

            <div className="mt-5 grid gap-5 xl:grid-cols-5">
              <div className="grid gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Necesita modelo
                </p>
                <DashboardOperationalList
                  items={dashboard.operationalQueues.needsModel}
                  emptyLabel="Todo lo de esta bandeja ya tiene modelo."
                />
              </div>

              <div className="grid gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Necesita fecha
                </p>
                <DashboardOperationalList
                  items={dashboard.operationalQueues.needsDate}
                  emptyLabel="No hay modelos sin fecha."
                />
              </div>

              <div className="grid gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Necesita fotos
                </p>
                {dashboard.operationalQueues.needsPhotos.length > 0 ? (
                  <div className="grid gap-3">
                    {dashboard.operationalQueues.needsPhotos.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[1.15rem] border border-line bg-[rgba(250,248,244,0.98)] px-4 py-4"
                      >
                        <Link href={item.href} className="block">
                          <p className="font-medium text-foreground">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-foreground/72">
                            {item.subtitle}
                          </p>
                        </Link>
                        <form
                          action={updateDashboardDressWorkflowAction}
                          className="mt-3"
                        >
                          <input type="hidden" name="dressId" value={item.id} />
                          <input
                            type="hidden"
                            name="workflowStatus"
                            value="PHOTOGRAPHED"
                          />
                          <button
                            type="submit"
                            className="app-button-secondary w-full"
                          >
                            Marcar fotografiado
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[1.15rem] border border-dashed border-line bg-[rgba(250,248,244,0.88)] px-4 py-5 text-sm text-foreground/72">
                    No hay vestidos pendientes de foto.
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Necesita carpeta
                </p>
                <DashboardOperationalList
                  items={dashboard.operationalQueues.needsFolder}
                  emptyLabel="Todo lo editado ya tiene carpeta."
                />
              </div>

              <div className="grid gap-3">
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Necesita publicación
                </p>
                <DashboardOperationalList
                  items={dashboard.operationalQueues.needsPublication}
                  emptyLabel="No hay publicaciones pendientes."
                />
              </div>
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

                  <form
                    action={saveDashboardLinkAction}
                    className="mt-4 grid gap-3"
                  >
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
                    <button
                      type="submit"
                      className="app-button-secondary w-full sm:w-auto"
                    >
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

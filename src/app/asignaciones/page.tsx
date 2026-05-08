import Link from "next/link";
import { getAssignmentSuggestions } from "@/lib/models";
import { workflowStatusLabels } from "@/lib/dresses";

type AssignmentsPageProps = {
  searchParams?: Promise<{
    workflowStatus?: string;
  }>;
};

function formatCurrency(value: number | null) {
  if (value === null) {
    return "Pendiente";
  }

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function AssignmentsPage({ searchParams }: AssignmentsPageProps) {
  const params = await searchParams;
  const data = await getAssignmentSuggestions();
  const selectedStatus = params?.workflowStatus ?? "";
  const filteredSuggestions = selectedStatus
    ? data.suggestions.filter((suggestion) => suggestion.workflowStatus === selectedStatus)
    : data.suggestions;

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">Módulo 03</p>
            <h1 className="font-heading text-5xl leading-[0.95] text-foreground sm:text-6xl">
              Asignaciones
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground/78">
              Aquí ves cada vestido con sus modelos sugeridas. Si quieres cambiar algo,
              abre el vestido y edítalo desde su ficha.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/vestidos" className="app-button-secondary">
              Ver vestidos
            </Link>
            <Link href="/modelos" className="app-button-primary">
              Ver modelos
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            Estás viendo sugerencias en modo demo. Cuando la base esté conectada, esta vista
            usará tus vestidos y modelos reales.
          </div>
        ) : null}
      </section>

      <section className="app-page">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Filtros</p>
            <h2 className="font-heading text-4xl text-foreground">Filtra asignaciones</h2>
          </div>
          <Link href="/asignaciones" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
            Limpiar filtros
          </Link>
        </div>

        <form className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
          <select name="workflowStatus" defaultValue={selectedStatus} className="app-field">
            <option value="">Todos los estados</option>
            <option value="PENDING_PHOTOS">Pendientes de foto</option>
            <option value="MODEL_ASSIGNED">Modelo asignada</option>
            <option value="IN_SESSION">En sesión</option>
          </select>
          <button type="submit" className="app-button-primary">
            Aplicar
          </button>
        </form>
      </section>

      <section className="app-page">
        <div className="border-b border-line pb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Resultado</p>
          <h2 className="mt-2 font-heading text-4xl leading-none text-foreground">
            {filteredSuggestions.length} asignaciones sugeridas
          </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredSuggestions.map((suggestion) => (
            <article key={suggestion.dressId} className="app-card">
              <div className="grid gap-4 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/vestidos/${suggestion.dressId}`}
                      className="font-heading text-3xl leading-none text-foreground underline-offset-4 hover:text-accent-strong hover:underline"
                    >
                      {suggestion.dressName}
                    </Link>
                    <span className="app-badge bg-slate-200 text-slate-700">
                      {suggestion.internalCode}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground/72">
                    {suggestion.brand ?? "Marca pendiente"} · Talla {suggestion.dressSize}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">Estado</p>
                    <span className="mt-2 inline-flex rounded-lg bg-accent/10 px-3 py-2 text-sm font-semibold text-accent">
                      {workflowStatusLabels[
                        suggestion.workflowStatus as keyof typeof workflowStatusLabels
                      ] ?? suggestion.workflowStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Modelos sugeridas
                    </p>
                    <p className="mt-2 text-sm leading-7 text-foreground/72">
                      {suggestion.suggestedModels.length}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                    Modelos sugeridas
                  </p>
                  <div
                    className={`mt-3 grid gap-3 ${
                      suggestion.suggestedModels.length > 1 ? "max-h-72 overflow-y-auto pr-1" : ""
                    }`}
                  >
                    {suggestion.suggestedModels.length > 0 ? (
                      suggestion.suggestedModels.slice(0, 3).map((model) => (
                        <div
                          key={model.id}
                          className="rounded-[1.15rem] border border-line bg-surface px-4 py-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-base font-semibold text-foreground">{model.name}</p>
                              <p className="mt-1 text-sm leading-6 text-foreground/72">Tallas: {model.sizes.join(", ")}</p>
                            </div>
                            {model.instagramHandle ? (
                              <span className="app-badge bg-slate-200 text-slate-700">
                                {model.instagramHandle}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-3 grid gap-1 text-sm leading-6 text-foreground/72">
                            <p>Por vestido: {formatCurrency(model.perDressRate)}</p>
                            <p>Por hora: {formatCurrency(model.hourlyRate)}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-[1.15rem] border border-dashed border-line bg-surface px-4 py-5 text-sm text-foreground/72">
                        No hay modelos compatibles para esta talla todavía.
                      </div>
                    )}
                  </div>
                </div>

                <Link href={`/vestidos/${suggestion.dressId}`} className="app-button-secondary text-center">
                  Abrir vestido
                </Link>
              </div>
            </article>
          ))}

          {filteredSuggestions.length === 0 ? (
            <div className="rounded-[1.35rem] border border-dashed border-line bg-surface px-4 py-6 text-sm text-foreground/72">
              No hay asignaciones para ese filtro.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

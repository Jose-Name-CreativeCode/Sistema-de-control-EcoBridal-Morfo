import Link from "next/link";
import { getAssignmentSuggestions } from "@/lib/models";
import { workflowStatusLabels } from "@/lib/dresses";

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

export default async function AssignmentsPage() {
  const data = await getAssignmentSuggestions();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_80px_rgba(64,34,24,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Módulo 03</p>
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              Asignaciones sugeridas
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground/75">
              Esta vista cruza la talla del vestido con las tallas compatibles de cada modelo
              para ayudarte a decidir rápido a quién convocar para la sesión.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vestidos"
              className="rounded-full border border-line bg-white px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
            >
              Ver vestidos
            </Link>
            <Link
              href="/modelos"
              className="rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#6f3b28]"
            >
              Ver modelos
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            Esta tabla está corriendo en modo demo. Cuando conectemos PostgreSQL, las sugerencias
            saldrán de tus vestidos y modelos reales.
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-5">
        {data.suggestions.map((suggestion) => (
          <article
            key={suggestion.dressId}
            className="rounded-[1.75rem] border border-line bg-white/80 p-6 shadow-[0_10px_30px_rgba(64,34,24,0.05)]"
          >
            <div className="flex flex-col gap-4 border-b border-line pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-heading text-3xl text-foreground">{suggestion.dressName}</p>
                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-700">
                    {suggestion.internalCode}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-foreground/72">
                  {suggestion.brand ?? "Marca pendiente"} · Talla {suggestion.dressSize}
                </p>
              </div>

              <div className="rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                {workflowStatusLabels[
                  suggestion.workflowStatus as keyof typeof workflowStatusLabels
                ] ?? suggestion.workflowStatus}
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {suggestion.suggestedModels.length > 0 ? (
                suggestion.suggestedModels.map((model) => (
                  <div
                    key={model.id}
                    className="rounded-[1.35rem] border border-line bg-surface p-4"
                  >
                    <p className="font-heading text-2xl text-foreground">{model.name}</p>
                    <p className="mt-2 text-sm leading-7 text-foreground/72">
                      Tallas: {model.sizes.join(", ")}
                    </p>
                    <p className="text-sm leading-7 text-foreground/72">
                      Por vestido: {formatCurrency(model.perDressRate)}
                    </p>
                    <p className="text-sm leading-7 text-foreground/72">
                      Por hora: {formatCurrency(model.hourlyRate)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.35rem] border border-dashed border-line bg-surface px-4 py-6 text-sm text-foreground/72">
                  No hay modelos compatibles para esta talla todavía.
                </div>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

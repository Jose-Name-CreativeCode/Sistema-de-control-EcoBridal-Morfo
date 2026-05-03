import Link from "next/link";
import { bulkUpdateDressStatusesAction } from "@/app/vestidos/actions";
import {
  getDressQuickEditRows,
  instagramStatusLabels,
  workflowStatusLabels,
} from "@/lib/dresses";

type BulkUpdatePageProps = {
  searchParams?: Promise<{
    saved?: string;
    demo?: string;
    empty?: string;
  }>;
};

export default async function BulkUpdatePage({ searchParams }: BulkUpdatePageProps) {
  const params = await searchParams;
  const data = await getDressQuickEditRows();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_80px_rgba(37,37,37,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Módulo 01C</p>
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              Actualización masiva
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground/75">
              Selecciona varios vestidos y aplica el mismo estado de fotografía o Instagram
              en una sola operación.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/vestidos" className="app-button-secondary">
              Volver a vestidos
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            La vista ya está lista, pero el guardado real se activará cuando conectemos
            PostgreSQL.
          </div>
        ) : null}

        {params?.saved === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            Los vestidos seleccionados se actualizaron correctamente.
          </div>
        ) : null}

        {params?.empty === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            Selecciona al menos un vestido y al menos un estado para aplicar.
          </div>
        ) : null}

        {params?.demo === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            No se pudo guardar porque el proyecto sigue en modo demo.
          </div>
        ) : null}
      </section>

      <form action={bulkUpdateDressStatusesAction} className="mt-8 grid gap-6">
        <section className="rounded-[2rem] border border-line bg-white/80 p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
            <label className="grid gap-2 text-sm text-foreground/75">
              Nuevo estado de fotografía
              <select
                name="workflowStatus"
                defaultValue=""
                className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
              >
                <option value="">No cambiar</option>
                {Object.entries(workflowStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Nuevo estado de Instagram
              <select
                name="instagramStatus"
                defaultValue=""
                className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
              >
                <option value="">No cambiar</option>
                {Object.entries(instagramStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <button type="submit" className="app-button-primary w-full lg:w-auto">
                Aplicar a seleccionados
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-line bg-surface p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
                Selección
              </p>
              <h2 className="font-heading text-4xl text-foreground">
                {data.dresses.length} vestidos disponibles
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.dresses.map((dress) => (
              <label
                key={dress.id}
                className="flex gap-4 rounded-[1.35rem] border border-line bg-white/85 p-4"
              >
                <input
                  type="checkbox"
                  name="dressIds"
                  value={dress.id}
                  className="mt-1 h-4 w-4 accent-[--color-accent]"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-2xl text-foreground">{dress.name}</p>
                    <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">
                      {dress.internalCode}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-foreground/72">
                    {dress.brand ?? "Marca pendiente"} · {dress.size}
                  </p>
                  <p className="text-sm leading-7 text-foreground/72">
                    {workflowStatusLabels[dress.workflowStatus]} ·{" "}
                    {instagramStatusLabels[dress.instagramStatus]}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </section>
      </form>
    </main>
  );
}

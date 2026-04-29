import Link from "next/link";
import { updateDressBasicsAction } from "@/app/vestidos/actions";
import {
  getDressQuickEditRows,
  instagramStatusLabels,
  workflowStatusLabels,
} from "@/lib/dresses";

type QuickEditPageProps = {
  searchParams?: Promise<{
    saved?: string;
    demo?: string;
  }>;
};

function formatCurrency(value: number | null) {
  if (value === null) return "";
  return String(value);
}

export default async function QuickEditPage({ searchParams }: QuickEditPageProps) {
  const params = await searchParams;
  const data = await getDressQuickEditRows();

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_80px_rgba(64,34,24,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Módulo 01B</p>
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              Edición rápida de vestidos
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground/75">
              Completa marca, talla, color, condición, precio y notas sin salir de una sola
              pantalla. Está pensada justo para limpiar el catálogo inicial.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vestidos"
              className="rounded-full border border-line bg-white px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
            >
              Volver a vestidos
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            Esta tabla está lista, pero el guardado real se activará cuando conectemos la base
            PostgreSQL. Mientras tanto te sirve para revisar la estructura del catálogo.
          </div>
        ) : null}

        {params?.saved === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            El vestido se actualizó correctamente.
          </div>
        ) : null}

        {params?.demo === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            No se pudo guardar porque el proyecto sigue en modo demo.
          </div>
        ) : null}
      </section>

      <section className="mt-8 grid gap-4">
        {data.dresses.map((dress) => (
          <form
            key={dress.id}
            action={updateDressBasicsAction}
            className="rounded-[1.6rem] border border-line bg-white/85 p-5 shadow-[0_10px_30px_rgba(64,34,24,0.05)]"
          >
            <input type="hidden" name="dressId" value={dress.id} />
            <div className="flex flex-col gap-4 border-b border-line pb-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-heading text-3xl text-foreground">{dress.name}</p>
                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-700">
                    {dress.internalCode}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-foreground/72">
                  {workflowStatusLabels[dress.workflowStatus]} ·{" "}
                  {instagramStatusLabels[dress.instagramStatus]}
                </p>
              </div>
              <Link
                href={`/vestidos/${dress.id}`}
                className="text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Abrir detalle
              </Link>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-6">
              <label className="grid gap-2 text-sm text-foreground/75">
                Marca
                <input
                  name="brand"
                  defaultValue={dress.brand ?? ""}
                  placeholder="Pronovias"
                  className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Talla
                <input
                  name="size"
                  defaultValue={dress.size}
                  placeholder="8"
                  className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Color
                <input
                  name="color"
                  defaultValue={dress.color ?? ""}
                  placeholder="Ivory"
                  className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Condición
                <select
                  name="condition"
                  defaultValue={dress.condition}
                  className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                >
                  <option value="USED">Usado</option>
                  <option value="NEW">Nuevo</option>
                  <option value="SAMPLE">Muestra</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Precio
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  defaultValue={formatCurrency(dress.price)}
                  placeholder="15999"
                  className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28]"
                >
                  Guardar
                </button>
              </div>
            </div>

            <label className="mt-4 grid gap-2 text-sm text-foreground/75">
              Notas
              <textarea
                name="notes"
                rows={3}
                defaultValue={dress.notes ?? ""}
                placeholder="Notas rápidas del vestido."
                className="rounded-3xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
          </form>
        ))}
      </section>
    </main>
  );
}

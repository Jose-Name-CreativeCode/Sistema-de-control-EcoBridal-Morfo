import Link from "next/link";
import { createDressAction } from "@/app/vestidos/actions";
import { isDatabaseConfigured } from "@/lib/database";
import { instagramStatusLabels, instagramStatusOptions, workflowStatusLabels, workflowStatusOptions } from "@/lib/dresses";

type NewDressPageProps = {
  searchParams?: Promise<{
    demo?: string;
  }>;
};

const conditionOptions = [
  { value: "USED", label: "Usado" },
  { value: "NEW", label: "Nuevo" },
  { value: "SAMPLE", label: "Muestra" },
] as const;

export default async function NewDressPage({ searchParams }: NewDressPageProps) {
  const params = await searchParams;
  const databaseReady = isDatabaseConfigured();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_80px_rgba(64,34,24,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Alta de vestido</p>
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              Registrar nuevo vestido
            </h1>
          </div>

          <Link
            href="/vestidos"
            className="rounded-full border border-line bg-white px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
          >
            Volver al listado
          </Link>
        </div>

        {!databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            El formulario ya está listo, pero el guardado real se activará cuando conectemos
            PostgreSQL. Por ahora puedes usar esta pantalla como referencia de los campos que
            llevará el sistema.
          </div>
        ) : null}

        {params?.demo === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            No se pudo guardar porque el proyecto sigue en modo demo. Configura `DATABASE_URL`
            para activar el registro real.
          </div>
        ) : null}

        <form action={createDressAction} className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-foreground/75">
            Código interno
            <input
              required
              name="internalCode"
              placeholder="ECO-105"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Nombre del vestido
            <input
              required
              name="name"
              placeholder="Ariadna"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Marca
            <input
              name="brand"
              placeholder="Pronovias"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Talla
            <input
              required
              name="size"
              placeholder="8"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Color
            <input
              name="color"
              placeholder="Ivory"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Precio
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="15999"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Estado del vestido
            <select
              name="condition"
              defaultValue="USED"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            >
              {conditionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Estado de fotografía
            <select
              name="workflowStatus"
              defaultValue="PENDING_PHOTOS"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            >
              {workflowStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {workflowStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Estado de Instagram
            <select
              name="instagramStatus"
              defaultValue="NOT_PUBLISHED"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            >
              {instagramStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {instagramStatusLabels[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Fecha de ingreso
            <input
              type="date"
              name="receivedAt"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="col-span-full flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-4 text-sm text-foreground/78">
            <input type="checkbox" name="isNew" className="h-4 w-4 accent-[--color-accent]" />
            Marcar como vestido nuevo
          </label>

          <label className="col-span-full grid gap-2 text-sm text-foreground/75">
            Notas
            <textarea
              name="notes"
              rows={5}
              placeholder="Observaciones internas, detalles de producción o notas sobre la sesión."
              className="rounded-3xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <div className="col-span-full flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28]"
            >
              Guardar vestido
            </button>
            <Link
              href="/vestidos"
              className="rounded-full border border-line bg-white px-6 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

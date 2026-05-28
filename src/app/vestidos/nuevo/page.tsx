import Link from "next/link";
import { createDressAction } from "@/app/vestidos/actions";
import { isDatabaseConfigured } from "@/lib/database";
import { getNextInternalCode } from "@/lib/internal-codes";
import {
  instagramStatusLabels,
  instagramStatusOptions,
  workflowStatusLabels,
  workflowStatusOptions,
} from "@/lib/dresses";

type NewDressPageProps = {
  searchParams?: Promise<{
    demo?: string;
    missing?: string;
  }>;
};

const conditionOptions = [
  { value: "USED", label: "Usado" },
  { value: "NEW", label: "Nuevo" },
  { value: "SAMPLE", label: "Propio de EcoBridal" },
] as const;

export default async function NewDressPage({
  searchParams,
}: NewDressPageProps) {
  const params = await searchParams;
  const databaseReady = isDatabaseConfigured();
  const nextInternalCode = databaseReady
    ? await getNextInternalCode()
    : "ECO-001";

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">
              Alta de vestido
            </p>
            <h1 className="mt-3 font-heading text-5xl leading-[0.95] text-foreground sm:text-6xl">
              Registrar nuevo vestido
            </h1>
          </div>

          <Link href="/vestidos" className="app-button-secondary">
            Volver al listado
          </Link>
        </div>

        {!databaseReady ? (
          <div className="mt-6 rounded-2xl border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            El formulario ya está listo, pero el guardado real se activará
            cuando conectemos PostgreSQL. Por ahora puedes usar esta pantalla
            como referencia de los campos que llevará el sistema.
          </div>
        ) : null}

        {params?.demo === "1" ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            No se pudo guardar porque el proyecto sigue en modo demo. Configura
            `DATABASE_URL` para activar el registro real.
          </div>
        ) : null}

        {params?.missing === "1" ? (
          <div className="mt-6 rounded-2xl border border-support-coral/30 bg-support-coral/10 px-5 py-4 text-sm text-foreground">
            El nombre y la talla del vestido son obligatorios para guardarlo.
          </div>
        ) : null}

        <form
          action={createDressAction}
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <label className="grid gap-2 text-sm text-foreground/75">
            Código interno
            <div className="app-field flex min-h-12 items-center text-foreground/72">
              {nextInternalCode}
            </div>
            <p className="text-xs leading-5 text-foreground/55">
              Se genera automáticamente para evitar repetir códigos.
            </p>
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Nombre del vestido
            <input
              required
              name="name"
              placeholder="Ariadna"
              className="app-field"
            />
            <p className="text-xs leading-5 text-transparent select-none">
              Se genera automáticamente para evitar repetir códigos.
            </p>
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Marca
            <input name="brand" placeholder="Pronovias" className="app-field" />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Talla
            <input required name="size" placeholder="8" className="app-field" />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Precio
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="15999"
              className="app-field"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Estado del vestido
            <select name="condition" defaultValue="USED" className="app-field">
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
              className="app-field"
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
              className="app-field"
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
            <input type="date" name="receivedAt" className="app-field" />
          </label>

          <label className="col-span-full flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-4 text-sm text-foreground/78">
            <input
              type="checkbox"
              name="isNew"
              className="h-4 w-4 accent-[--color-accent]"
            />
            Marcar como vestido nuevo
          </label>

          <label className="col-span-full grid gap-2 text-sm text-foreground/75">
            Notas
            <textarea
              name="notes"
              rows={5}
              placeholder="Observaciones internas, detalles de producción o notas sobre la sesión."
              className="app-field min-h-36 resize-y"
            />
          </label>

          <div className="col-span-full flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="app-button-primary">
              Guardar vestido
            </button>
            <Link href="/vestidos" className="app-button-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

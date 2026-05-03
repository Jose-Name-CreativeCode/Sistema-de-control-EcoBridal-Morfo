import Link from "next/link";
import { createModelAction } from "@/app/modelos/actions";
import { isDatabaseConfigured } from "@/lib/database";

type NewModelPageProps = {
  searchParams?: Promise<{
    demo?: string;
  }>;
};

export default async function NewModelPage({ searchParams }: NewModelPageProps) {
  const params = await searchParams;
  const databaseReady = isDatabaseConfigured();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_80px_rgba(37,37,37,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Alta de modelo</p>
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              Registrar modelo
            </h1>
          </div>

          <Link href="/modelos" className="app-button-secondary">
            Volver al listado
          </Link>
        </div>

        {!databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            El guardado quedará activo en cuanto conectemos PostgreSQL. Mientras tanto, esta
            pantalla ya define el formulario real que usará tu equipo para dar de alta modelos.
          </div>
        ) : null}

        {params?.demo === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            No se pudo guardar porque el proyecto sigue en modo demo. Configura `DATABASE_URL`
            para activar el registro real.
          </div>
        ) : null}

        <form action={createModelAction} className="mt-8 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-foreground/75">
            Nombre
            <input
              required
              name="name"
              placeholder="Sofía Ramírez"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Instagram
            <input
              name="instagramHandle"
              placeholder="@sofia.morfo"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Teléfono
            <input
              name="contactPhone"
              placeholder="55 1234 5678"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Correo
            <input
              type="email"
              name="contactEmail"
              placeholder="modelo@correo.com"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Costo por hora
            <input
              type="number"
              step="0.01"
              name="hourlyRate"
              placeholder="450"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Costo por vestido
            <input
              type="number"
              step="0.01"
              name="perDressRate"
              placeholder="180"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Tallas compatibles
            <input
              required
              name="sizes"
              placeholder="6, 8, 10"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Disponibilidad
            <input
              name="availability"
              placeholder="Lunes y miércoles"
              className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <label className="col-span-full grid gap-2 text-sm text-foreground/75">
            Notas
            <textarea
              name="notes"
              rows={5}
              placeholder="Notas sobre estilo, experiencia, sesiones pasadas o consideraciones internas."
              className="rounded-3xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>

          <div className="col-span-full flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="app-button-primary">
              Guardar modelo
            </button>
            <Link href="/modelos" className="app-button-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

import Link from "next/link";
import { getModelCatalogData } from "@/lib/models";

type ModelsPageProps = {
  searchParams?: Promise<{
    search?: string;
    size?: string;
    created?: string;
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

export default async function ModelsPage({ searchParams }: ModelsPageProps) {
  const params = await searchParams;
  const data = await getModelCatalogData({
    search: params?.search,
    size: params?.size,
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_80px_rgba(64,34,24,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Módulo 02</p>
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              Modelos
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground/75">
              Aquí controlas tallas compatibles, disponibilidad, contacto y costo por
              vestido u hora. Este módulo alimenta directamente las asignaciones para cada
              sesión.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/asignaciones"
              className="rounded-full border border-line bg-white px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
            >
              Ver asignaciones
            </Link>
            <Link
              href="/modelos/nuevo"
              className="rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#6f3b28]"
            >
              Registrar modelo
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            Estás viendo el módulo en modo demo. La estructura ya está preparada para que,
            al conectar PostgreSQL, puedas guardar modelos reales y usarlas en las
            asignaciones de vestidos.
          </div>
        ) : null}

        {params?.created === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            La modelo se registró correctamente.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Modelos activas", value: data.totalCount },
            { label: "Tallas cubiertas", value: data.sizes.length },
            { label: "Promedio por vestido", value: formatCurrency(data.averagePerDressRate) },
          ].map((item) => (
            <article
              key={item.label}
              className="rounded-[1.35rem] border border-line bg-white/80 p-5"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                {item.label}
              </p>
              <p className="mt-3 font-heading text-5xl text-accent">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-line bg-white/75 p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Filtros
            </p>
            <h2 className="font-heading text-4xl text-foreground">Busca por talla o nombre</h2>
          </div>
          <Link
            href="/modelos"
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Limpiar filtros
          </Link>
        </div>

        <form className="mt-6 grid gap-4 sm:grid-cols-[1.5fr_1fr_auto]">
          <input
            type="text"
            name="search"
            defaultValue={params?.search ?? ""}
            placeholder="Nombre, Instagram o teléfono"
            className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
          />
          <select
            name="size"
            defaultValue={params?.size ?? ""}
            className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Todas las tallas</option>
            {data.sizes.map((size) => (
              <option key={size} value={size}>
                Talla {size}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28]"
          >
            Aplicar
          </button>
        </form>
      </section>

      <section className="mt-8 grid gap-4">
        {data.models.map((model) => (
          <article
            key={model.id}
            className="rounded-[1.6rem] border border-line bg-surface p-6 shadow-[0_10px_30px_rgba(64,34,24,0.05)]"
          >
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-heading text-3xl text-foreground">{model.name}</p>
                  {model.instagramHandle ? (
                    <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">
                      {model.instagramHandle}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-7 text-foreground/72">
                  {model.contactPhone ?? "Teléfono pendiente"} ·{" "}
                  {model.contactEmail ?? "Correo pendiente"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Tallas
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.sizes.map((size) => (
                    <span
                      key={`${model.id}-${size}`}
                      className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Tarifas
                </p>
                <p className="mt-2 text-sm leading-7 text-foreground/75">
                  Por vestido: {formatCurrency(model.perDressRate)}
                </p>
                <p className="text-sm leading-7 text-foreground/75">
                  Por hora: {formatCurrency(model.hourlyRate)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Disponibilidad
                </p>
                <p className="mt-2 text-sm leading-7 text-foreground/75">
                  {model.availability ?? "Pendiente de definir"}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

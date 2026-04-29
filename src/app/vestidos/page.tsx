import Link from "next/link";
import {
  getDressCatalogData,
  getInstagramStatusBadgeClasses,
  getWorkflowStatusBadgeClasses,
  instagramStatusLabels,
  instagramStatusOptions,
  workflowStatusLabels,
  workflowStatusOptions,
} from "@/lib/dresses";

type DressesPageProps = {
  searchParams?: Promise<{
    search?: string;
    brand?: string;
    size?: string;
    workflowStatus?: string;
    instagramStatus?: string;
    novelty?: string;
    created?: string;
  }>;
};

function formatDate(value: Date | null) {
  if (!value) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function DressesPage({ searchParams }: DressesPageProps) {
  const params = await searchParams;

  const data = await getDressCatalogData({
    search: params?.search,
    brand: params?.brand,
    size: params?.size,
    workflowStatus: (params?.workflowStatus as
      | (typeof workflowStatusOptions)[number]
      | ""
      | undefined) ?? "",
    instagramStatus: (params?.instagramStatus as
      | (typeof instagramStatusOptions)[number]
      | ""
      | undefined) ?? "",
    novelty:
      params?.novelty === "new" || params?.novelty === "existing"
        ? params.novelty
        : "all",
  });

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_80px_rgba(64,34,24,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Módulo 01</p>
            <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
              Vestidos
            </h1>
            <p className="mt-4 text-lg leading-8 text-foreground/75">
              Filtra por nombre, marca, talla, estado de fotografía o estado de
              Instagram. Aquí es donde tu equipo puede ver qué vestidos faltan y cuáles
              ya tienen evidencia de publicación.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-full border border-line bg-white px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
            >
              Volver al inicio
            </Link>
            <Link
              href="/vestidos/edicion-rapida"
              className="rounded-full border border-line bg-white px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
            >
              Edición rápida
            </Link>
            <Link
              href="/vestidos/actualizacion-masiva"
              className="rounded-full border border-line bg-white px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
            >
              Actualización masiva
            </Link>
            <Link
              href="/vestidos/nuevo"
              className="rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#6f3b28]"
            >
              Registrar vestido
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            Estás viendo el módulo en modo demo porque todavía no hay una base PostgreSQL
            conectada. La interfaz ya está lista; en cuanto configures `DATABASE_URL`,
            este listado empezará a trabajar con datos reales.
          </div>
        ) : null}

        {params?.created === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            El vestido se registró correctamente.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { label: "Vestidos totales", value: data.totalCount },
            { label: "Pendientes de foto", value: data.pendingPhotoCount },
            { label: "Publicados", value: data.publishedCount },
            { label: "Nuevos", value: data.newCount },
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
            <h2 className="font-heading text-4xl text-foreground">Busca rápido</h2>
          </div>
          <Link
            href="/vestidos"
            className="text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Limpiar filtros
          </Link>
        </div>

        <form className="mt-6 grid gap-4 lg:grid-cols-6">
          <input
            type="text"
            name="search"
            defaultValue={params?.search ?? ""}
            placeholder="Nombre, marca o código"
            className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent lg:col-span-2"
          />

          <select
            name="brand"
            defaultValue={params?.brand ?? ""}
            className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Todas las marcas</option>
            {data.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            name="size"
            defaultValue={params?.size ?? ""}
            className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Todas las tallas</option>
            {data.sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <select
            name="workflowStatus"
            defaultValue={params?.workflowStatus ?? ""}
            className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Todos los estados de foto</option>
            {workflowStatusOptions.map((status) => (
              <option key={status} value={status}>
                {workflowStatusLabels[status]}
              </option>
            ))}
          </select>

          <select
            name="instagramStatus"
            defaultValue={params?.instagramStatus ?? ""}
            className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="">Todos los estados de Instagram</option>
            {instagramStatusOptions.map((status) => (
              <option key={status} value={status}>
                {instagramStatusLabels[status]}
              </option>
            ))}
          </select>

          <select
            name="novelty"
            defaultValue={params?.novelty ?? "all"}
            className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent"
          >
            <option value="all">Todos</option>
            <option value="new">Solo nuevos</option>
            <option value="existing">Solo existentes</option>
          </select>

          <button
            type="submit"
            className="rounded-2xl bg-accent px-4 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28]"
          >
            Aplicar filtros
          </button>
        </form>
      </section>

      <section className="mt-8 rounded-[2rem] border border-line bg-surface p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Resultado
            </p>
            <h2 className="font-heading text-4xl text-foreground">
              {data.dresses.length} vestidos encontrados
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {data.dresses.map((dress) => (
            <article
              key={dress.id}
              className="grid gap-4 rounded-[1.5rem] border border-line bg-white/80 p-5 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.6fr]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/vestidos/${dress.id}`}
                    className="font-heading text-3xl text-foreground underline-offset-4 hover:underline"
                  >
                    {dress.name}
                  </Link>
                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-700">
                    {dress.internalCode}
                  </span>
                  {dress.isNew ? (
                    <span className="rounded-full bg-accent px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                      Nuevo
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-7 text-foreground/72">
                  {dress.brand ?? "Marca pendiente"} · Talla {dress.size} ·{" "}
                  {dress.color ?? "Color pendiente"}
                </p>
                <Link
                  href={`/vestidos/${dress.id}`}
                  className="mt-3 inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
                >
                  Ver detalle del vestido
                </Link>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Fotografía
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-2 text-sm font-medium ${getWorkflowStatusBadgeClasses(
                    dress.workflowStatus,
                  )}`}
                >
                  {workflowStatusLabels[dress.workflowStatus]}
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Instagram
                </p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-2 text-sm font-medium ${getInstagramStatusBadgeClasses(
                    dress.instagramStatus,
                  )}`}
                >
                  {instagramStatusLabels[dress.instagramStatus]}
                </span>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                  Ingreso
                </p>
                <p className="mt-2 text-sm text-foreground/75">
                  {formatDate(dress.receivedAt)}
                </p>
              </div>
            </article>
          ))}

          {data.dresses.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-line bg-white/70 px-5 py-10 text-center text-sm text-foreground/70">
              No se encontraron vestidos con esos filtros.
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

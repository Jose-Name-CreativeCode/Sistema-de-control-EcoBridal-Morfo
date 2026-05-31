// message wron

import Link from "next/link";
import {
  dressSortOptions,
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
    sort?: string;
    created?: string;
    deleted?: string;
    page?: string;
  }>;
};

const DRESSES_PER_PAGE = 12;

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
    workflowStatus:
      (params?.workflowStatus as
        | (typeof workflowStatusOptions)[number]
        | ""
        | undefined) ?? "",
    instagramStatus:
      (params?.instagramStatus as
        | (typeof instagramStatusOptions)[number]
        | ""
        | undefined) ?? "",
    novelty:
      params?.novelty === "new" ||
      params?.novelty === "existing" ||
      params?.novelty === "used" ||
      params?.novelty === "sample" ||
      params?.novelty === "sold" ||
      params?.novelty === "returned" ||
      params?.novelty === "in_stock"
        ? params.novelty
        : "all",
    sort:
      params?.sort &&
      dressSortOptions.includes(
        params.sort as (typeof dressSortOptions)[number],
      )
        ? (params.sort as (typeof dressSortOptions)[number])
        : "name-asc",
  });
  const requestedPage = Number(params?.page ?? "1");
  const totalPages = Math.max(
    1,
    Math.ceil(data.dresses.length / DRESSES_PER_PAGE),
  );
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(Math.floor(requestedPage), totalPages)
      : 1;
  const pageStart = (currentPage - 1) * DRESSES_PER_PAGE;
  const paginatedDresses = data.dresses.slice(
    pageStart,
    pageStart + DRESSES_PER_PAGE,
  );
  const visiblePages = new Set<number>([1, totalPages]);

  if (totalPages <= 7) {
    for (let page = 1; page <= totalPages; page += 1) {
      visiblePages.add(page);
    }
  } else if (currentPage <= 4) {
    for (let page = 1; page <= 5; page += 1) {
      visiblePages.add(page);
    }
  } else if (currentPage >= totalPages - 3) {
    for (let page = totalPages - 4; page <= totalPages; page += 1) {
      visiblePages.add(page);
    }
  } else {
    for (let page = currentPage - 1; page <= currentPage + 1; page += 1) {
      visiblePages.add(page);
    }
  }

  const paginationItems: Array<number | "start-ellipsis" | "end-ellipsis"> = [];
  const orderedVisiblePages = Array.from(visiblePages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((left, right) => left - right);

  orderedVisiblePages.forEach((page, index) => {
    paginationItems.push(page);

    const nextPage = orderedVisiblePages[index + 1];

    if (!nextPage) {
      return;
    }

    if (nextPage - page > 1) {
      paginationItems.push(
        page < currentPage ? "start-ellipsis" : "end-ellipsis",
      );
    }
  });

  function buildPageHref(page: number) {
    const query = new URLSearchParams();

    if (params?.search) query.set("search", params.search);
    if (params?.brand) query.set("brand", params.brand);
    if (params?.size) query.set("size", params.size);
    if (params?.workflowStatus) {
      query.set("workflowStatus", params.workflowStatus);
    }
    if (params?.instagramStatus) {
      query.set("instagramStatus", params.instagramStatus);
    }
    if (params?.novelty && params.novelty !== "all") {
      query.set("novelty", params.novelty);
    }
    if (params?.sort && params.sort !== "name-asc") {
      query.set("sort", params.sort);
    }
    if (page > 1) query.set("page", String(page));

    const queryString = query.toString();
    return queryString ? `/vestidos?${queryString}` : "/vestidos";
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="flex flex-col gap-6 border-b border-line pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">
              Módulo 01
            </p>
            <h1 className="mt-3 font-heading text-4xl leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">
              Vestidos
            </h1>
            <p className="mt-4 text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8">
              Filtra por nombre, marca, talla, estado de fotografía y estado de
              Instagram. Aquí puedes detectar qué vestidos faltan por
              fotografiar y cuáles ya tienen evidencia y publicación.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/vestidos/nuevo" className="app-button-primary">
              Registrar vestido
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-2xl border border-dashed border-accent-strong/30 bg-accent-strong/6 px-5 py-4 text-sm leading-7 text-foreground/78">
            Estás viendo este módulo en modo demo. En cuanto la conexión esté
            lista, el catálogo se leerá desde PostgreSQL.
          </div>
        ) : null}

        {params?.created === "1" ? (
          <div className="mt-6 rounded-2xl border border-lime-300 bg-lime-50 px-5 py-4 text-sm text-lime-950">
            El vestido se registró correctamente.
          </div>
        ) : null}

        {params?.deleted === "1" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            El vestido se eliminó correctamente.
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {[
            { label: "Vestidos totales", value: data.totalCount },
            { label: "Pendientes de foto", value: data.pendingPhotoCount },
            { label: "Publicados", value: data.publishedCount },
            { label: "Nuevos", value: data.newCount },
          ].map((item) => (
            <article key={item.label} className="app-card h-full p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                {item.label}
              </p>
              <p className="mt-3 font-heading text-4xl leading-none text-accent-strong sm:text-5xl">
                {item.value}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-page">
        <div className="flex flex-col gap-4 border-b border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Filtros
            </p>
            <h2 className="mt-2 font-heading text-3xl leading-none text-foreground sm:text-4xl">
              Busca rápido
            </h2>
          </div>
          <Link
            href="/vestidos"
            className="text-sm font-semibold text-accent-strong underline-offset-4 hover:underline"
          >
            Limpiar filtros
          </Link>
        </div>

        <form className="mt-6 grid gap-4 xl:grid-cols-6">
          <input
            type="text"
            name="search"
            defaultValue={params?.search ?? ""}
            placeholder="Nombre, marca o código"
            className="app-field xl:col-span-2"
          />

          <select
            name="brand"
            defaultValue={params?.brand ?? ""}
            className="app-field"
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
            className="app-field"
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
            className="app-field"
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
            className="app-field"
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
            className="app-field xl:col-span-2"
          >
            <option value="all">Todos</option>
            <option value="new">Solo nuevos</option>
            <option value="existing">Solo existentes</option>
            <option value="used">Usados</option>
            <option value="sample">Propios de EcoBridal</option>
            <option value="in_stock">En existencia</option>
            <option value="sold">Vendidos</option>
            <option value="returned">Devueltos</option>
          </select>

          <select
            name="sort"
            defaultValue={params?.sort ?? "name-asc"}
            className="app-field xl:col-span-2"
          >
            <option value="name-asc">Nombre A a Z</option>
            <option value="name-desc">Nombre Z a A</option>
            <option value="code-asc">ID ECO menor a mayor</option>
            <option value="code-desc">ID ECO mayor a menor</option>
          </select>

          <button type="submit" className="app-button-primary xl:col-span-2">
            Aplicar filtros
          </button>
        </form>
      </section>

      <section className="app-page">
        <div className="border-b border-line pb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
            Resultado
          </p>
          <h2 className="mt-2 font-heading text-3xl leading-none text-foreground sm:text-4xl">
            {data.dresses.length} vestidos encontrados
          </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedDresses.map((dress) => (
            <article key={dress.id} className="app-card overflow-hidden">
              <Link href={`/vestidos/${dress.id}`} className="block">
                <div className="relative h-64 overflow-hidden bg-surface-strong sm:h-72">
                  {dress.previewPhotoUrl ? (
                    <img
                      src={dress.previewPhotoUrl}
                      alt={dress.name}
                      className="h-full w-full object-cover object-[center_10%] transition duration-300 hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#eef3ff,#dce6fb)] px-8 text-center">
                      <p className="font-heading text-4xl text-accent-strong">
                        {dress.name}
                      </p>
                    </div>
                  )}
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className="app-badge bg-white/90 text-slate-700">
                      {dress.internalCode}
                    </span>
                    {dress.isNew ? (
                      <span className="app-badge bg-accent-strong text-white">
                        Nuevo
                      </span>
                    ) : null}
                  </div>
                </div>
              </Link>

              <div className="grid gap-4 p-5">
                <div>
                  <Link
                    href={`/vestidos/${dress.id}`}
                    className="font-heading text-3xl leading-none text-foreground underline-offset-4 hover:text-accent-strong hover:underline"
                  >
                    {dress.name}
                  </Link>
                  <p className="mt-3 text-sm leading-7 text-foreground/72">
                    {dress.brand ?? "Marca pendiente"} · Talla {dress.size}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Fotografía
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-lg px-3 py-2 text-sm font-semibold ${getWorkflowStatusBadgeClasses(
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
                      className={`mt-2 inline-flex rounded-lg px-3 py-2 text-sm font-semibold ${getInstagramStatusBadgeClasses(
                        dress.instagramStatus,
                      )}`}
                    >
                      {instagramStatusLabels[dress.instagramStatus]}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2 text-sm text-foreground/75">
                  <p>Ingreso: {formatDate(dress.receivedAt)}</p>
                </div>

                <Link
                  href={`/vestidos/${dress.id}`}
                  className="app-button-secondary"
                >
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}

          {data.dresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-white/70 px-5 py-10 text-center text-sm text-foreground/70 md:col-span-2 xl:col-span-3">
              No se encontraron vestidos con esos filtros.
            </div>
          ) : null}
        </div>

        {totalPages > 1 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 border-t border-line pt-6">
            <Link
              href={buildPageHref(Math.max(1, currentPage - 1))}
              aria-disabled={currentPage === 1}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                currentPage === 1
                  ? "pointer-events-none border border-line bg-surface text-foreground/45"
                  : "border border-line bg-white text-foreground hover:border-accent hover:text-accent"
              }`}
            >
              Anterior
            </Link>

            {paginationItems.map((item, index) =>
              typeof item === "number" ? (
                <Link
                  key={item}
                  href={buildPageHref(item)}
                  className={`min-w-10 rounded-full px-4 py-2 text-center text-sm font-medium transition ${
                    item === currentPage
                      ? "bg-accent text-white"
                      : "border border-line bg-white text-foreground hover:border-accent hover:text-accent"
                  }`}
                >
                  {item}
                </Link>
              ) : (
                <span
                  key={`${item}-${index}`}
                  className="px-2 py-2 text-sm text-foreground/55"
                >
                  ...
                </span>
              ),
            )}

            <Link
              href={buildPageHref(Math.min(totalPages, currentPage + 1))}
              aria-disabled={currentPage === totalPages}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                currentPage === totalPages
                  ? "pointer-events-none border border-line bg-surface text-foreground/45"
                  : "border border-line bg-white text-foreground hover:border-accent hover:text-accent"
              }`}
            >
              Siguiente
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}

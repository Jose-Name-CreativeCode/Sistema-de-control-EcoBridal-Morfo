import Link from "next/link";
import { getModelCatalogData } from "@/lib/models";

type ModelsPageProps = {
  searchParams?: Promise<{
    search?: string;
    size?: string;
    created?: string;
    deleted?: string;
    page?: string;
  }>;
};

const MODELS_PER_PAGE = 6;

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

function buildInstagramUrl(handle: string) {
  const cleanHandle = handle.replace(/^@/, "").trim();
  return `https://instagram.com/${cleanHandle}`;
}

function getRateLines(model: {
  perDressRate: number | null;
  hourlyRate: number | null;
}) {
  const lines: string[] = [];

  if (model.perDressRate !== null) {
    lines.push(`Por vestido: ${formatCurrency(model.perDressRate)}`);
  }

  if (model.hourlyRate !== null) {
    lines.push(`Por hora: ${formatCurrency(model.hourlyRate)}`);
  }

  if (lines.length === 0) {
    lines.push("Tarifa pendiente");
  }

  return lines;
}

export default async function ModelsPage({ searchParams }: ModelsPageProps) {
  const params = await searchParams;
  const data = await getModelCatalogData({
    search: params?.search,
    size: params?.size,
  });
  const requestedPage = Number(params?.page ?? "1");
  const totalPages = Math.max(
    1,
    Math.ceil(data.models.length / MODELS_PER_PAGE),
  );
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(Math.floor(requestedPage), totalPages)
      : 1;
  const pageStart = (currentPage - 1) * MODELS_PER_PAGE;
  const paginatedModels = data.models.slice(
    pageStart,
    pageStart + MODELS_PER_PAGE,
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
    if (params?.size) query.set("size", params.size);
    if (page > 1) query.set("page", String(page));

    const queryString = query.toString();
    return queryString ? `/modelos?${queryString}` : "/modelos";
  }

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">Módulo 02</p>
            <h1 className="font-heading text-4xl leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">
              Modelos
            </h1>
            <p className="mt-4 text-base leading-7 text-foreground/78 sm:text-lg sm:leading-8">
              Aquí ves a cada modelo como ficha visual, con su foto, tallas, tarifas,
              disponibilidad e Instagram.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/modelos/nuevo" className="app-button-primary">
              Registrar modelo
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            Estás viendo el módulo en modo demo. Al conectar PostgreSQL podrás guardar
            modelos reales, editar su ficha y asignarlas a vestidos.
          </div>
        ) : null}

        {params?.created === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            La modelo se registró correctamente.
          </div>
        ) : null}

        {params?.deleted === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            La modelo se eliminó correctamente.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { label: "Modelos activas", value: data.totalCount },
            { label: "Tallas cubiertas", value: data.sizes.length },
            { label: "Promedio por vestido", value: formatCurrency(data.averagePerDressRate) },
          ].map((item) => (
            <article key={item.label} className="app-card p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                {item.label}
              </p>
              <p className="mt-3 font-heading text-4xl text-accent-strong sm:text-5xl">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-page">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Filtros</p>
            <h2 className="font-heading text-3xl text-foreground sm:text-4xl">Busca por talla o nombre</h2>
          </div>
          <Link href="/modelos" className="text-sm font-medium text-accent underline-offset-4 hover:underline">
            Limpiar filtros
          </Link>
        </div>

        <form className="mt-6 grid gap-4 sm:grid-cols-[1.5fr_1fr_auto]">
          <input
            type="text"
            name="search"
            defaultValue={params?.search ?? ""}
            placeholder="Nombre, Instagram o teléfono"
            className="app-field"
          />
          <select name="size" defaultValue={params?.size ?? ""} className="app-field">
            <option value="">Todas las tallas</option>
            {data.sizes.map((size) => (
              <option key={size} value={size}>
                Talla {size}
              </option>
            ))}
          </select>
          <button type="submit" className="app-button-primary">
            Aplicar
          </button>
        </form>
      </section>

      <section className="app-page">
        <div className="border-b border-line pb-4">
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Resultado</p>
            <h2 className="mt-2 font-heading text-3xl leading-none text-foreground sm:text-4xl">
              {data.models.length} modelos registradas
            </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {paginatedModels.map((model) => (
            <article key={model.id} className="app-card overflow-hidden">
              <Link href={`/modelos/${model.id}`} className="block">
                <div className="relative h-64 overflow-hidden bg-surface-strong sm:h-72">
                  {model.photoUrl ? (
                    <img
                      src={model.photoUrl}
                      alt={model.name}
                      className="h-full w-full object-cover object-[center_20%] transition duration-300 hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#eef3ff,#dce6fb)] px-8 text-center">
                      <p className="font-heading text-4xl text-accent-strong">{model.name}</p>
                    </div>
                  )}
                  {model.instagramHandle ? (
                    <div className="absolute left-4 top-4">
                      <a
                        href={buildInstagramUrl(model.instagramHandle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="app-badge bg-white/90 text-slate-700 no-underline transition hover:bg-foreground hover:!text-white"
                      >
                        {model.instagramHandle}
                      </a>
                    </div>
                  ) : null}
                </div>
              </Link>

              <div className="grid gap-4 p-5">
                <div>
                  <Link
                    href={`/modelos/${model.id}`}
                    className="font-heading text-3xl leading-none text-foreground underline-offset-4 hover:text-accent-strong hover:underline"
                  >
                    {model.name}
                  </Link>
                  <p className="mt-3 text-sm leading-7 text-foreground/72">
                    {model.contactPhone ?? "Teléfono pendiente"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
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
                      Disponibilidad
                    </p>
                    <p className="mt-2 text-sm leading-7 text-foreground/75">
                      {model.availability ?? "Pendiente"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 text-sm leading-7 text-foreground/75">
                  {getRateLines(model).map((line) => (
                    <p key={`${model.id}-${line}`}>{line}</p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  {model.folderUrl ? (
                    <a
                      href={model.folderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-button-secondary text-center"
                    >
                      Abrir carpeta
                    </a>
                  ) : null}
                  {model.instagramPostUrl ? (
                    <a
                      href={model.instagramPostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-button-secondary text-center"
                    >
                      Abrir publicación
                    </a>
                  ) : null}
                </div>

                <Link href={`/modelos/${model.id}`} className="app-button-secondary text-center">
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}
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

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

function buildInstagramUrl(handle: string) {
  const cleanHandle = handle.replace(/^@/, "").trim();
  return `https://instagram.com/${cleanHandle}`;
}

function getFolderProviderLabel(
  provider: "OUTLOOK_ONEDRIVE" | "SHAREPOINT" | "GOOGLE_DRIVE" | "OTHER" | null,
) {
  switch (provider) {
    case "OUTLOOK_ONEDRIVE":
      return "OneDrive";
    case "SHAREPOINT":
      return "SharePoint";
    case "GOOGLE_DRIVE":
      return "Google Drive";
    case "OTHER":
      return "Otro";
    default:
      return "Carpeta";
  }
}

export default async function ModelsPage({ searchParams }: ModelsPageProps) {
  const params = await searchParams;
  const data = await getModelCatalogData({
    search: params?.search,
    size: params?.size,
  });

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
            <Link href="/asignaciones" className="app-button-secondary">
              Ver asignaciones
            </Link>
            <Link href="/modelos/nuevo" className="app-button-primary">
              Registrar modelo
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            Estás viendo el módulo en modo demo. Al conectar PostgreSQL podrás guardar
            modelos reales, editar su ficha y usarlas en asignaciones.
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
              {data.models.length} modelos encontradas
            </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.models.map((model) => (
            <article key={model.id} className="app-card overflow-hidden">
              <Link href={`/modelos/${model.id}`} className="block">
                <div className="relative h-64 overflow-hidden bg-surface-strong sm:h-72">
                  {model.photoUrl ? (
                    <img
                      src={model.photoUrl}
                      alt={model.name}
                      className="h-full w-full object-cover object-center transition duration-300 hover:scale-[1.04]"
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
                  <p>Por vestido: {formatCurrency(model.perDressRate)}</p>
                  <p>Por hora: {formatCurrency(model.hourlyRate)}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {model.folderUrl ? (
                    <a
                      href={model.folderUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="app-button-secondary text-center"
                    >
                      Abrir {getFolderProviderLabel(model.folderProvider)}
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
      </section>
    </main>
  );
}

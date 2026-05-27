import Link from "next/link";
import { notFound } from "next/navigation";
import { updateModelAction } from "@/app/modelos/actions";
import { getModelDetailData } from "@/lib/models";
import { ModelPhotoZoom } from "@/components/model-photo-zoom";

type ModelDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    edit?: string;
    saved?: string;
    missing?: string;
    demo?: string;
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

function formatDate(value: Date | null) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

export default async function ModelDetailPage({
  params,
  searchParams,
}: ModelDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const data = await getModelDetailData(id);

  if (!data) {
    notFound();
  }

  const { model } = data;
  const isEditing = query?.edit === "1";

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">
              Detalle de modelo
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-4xl leading-[0.95] text-foreground sm:text-5xl lg:text-6xl">
                {model.name}
              </h1>
              {model.instagramHandle ? (
                <a
                  href={buildInstagramUrl(model.instagramHandle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-stone-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-700 no-underline transition hover:bg-foreground hover:!text-white"
                >
                  {model.instagramHandle}
                </a>
              ) : null}
            </div>
            <p className="mt-4 text-base leading-7 text-foreground/75 sm:text-lg sm:leading-8">
              {model.availability ?? "Disponibilidad pendiente"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/modelos" className="app-button-secondary">
              Volver al listado
            </Link>
            <Link
              href={
                isEditing
                  ? `/modelos/${model.id}`
                  : `/modelos/${model.id}?edit=1`
              }
              className="app-button-primary"
            >
              {isEditing ? "Ver resumen" : "Editar información"}
            </Link>
          </div>
        </div>

        {query?.saved === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            La información de la modelo se actualizó correctamente.
          </div>
        ) : null}

        {query?.missing === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-support-coral/30 bg-support-coral/10 px-5 py-4 text-sm text-foreground">
            El nombre es obligatorio para guardar la modelo.
          </div>
        ) : null}

        {query?.demo === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            `` La acción no se guardó porque el proyecto sigue en modo demo.
          </div>
        ) : null}
      </section>

      {!isEditing ? (
        <>
          <section className="app-page">
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr] items-stretch">
              <article className="app-card overflow-hidden p-0 h-full">
                <div className="h-[800px] overflow-hidden bg-surface-strong">
                  {model.photoUrl ? (
                    <ModelPhotoZoom
                      photoUrl={model.photoUrl}
                      modelName={model.name}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#eef3ff,#dce6fb)] px-8 text-center">
                      <p className="font-heading text-4xl text-accent-strong">
                        {model.name}
                      </p>
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[2rem] border border-line bg-white/80 p-6">
                <div className="border-b border-line pb-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
                    Resumen de la modelo
                  </p>
                  <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
                    Datos principales
                  </h2>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Nombre
                    </p>
                    <p className="mt-2 text-lg font-medium text-foreground">
                      {model.name}
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Instagram
                    </p>
                    {model.instagramHandle ? (
                      <a
                        href={buildInstagramUrl(model.instagramHandle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-lg font-medium text-foreground no-underline transition hover:text-accent-strong"
                      >
                        {model.instagramHandle}
                      </a>
                    ) : (
                      <p className="mt-2 text-lg font-medium text-foreground">
                        Pendiente
                      </p>
                    )}
                  </div>
                  <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Disponibilidad
                    </p>
                    <p className="mt-2 text-lg font-medium text-foreground">
                      {model.availability ?? "Pendiente"}
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Por vestido
                    </p>
                    <p className="mt-2 text-lg font-medium text-foreground">
                      {formatCurrency(model.perDressRate)}
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Por hora
                    </p>
                    <p className="mt-2 text-lg font-medium text-foreground">
                      {formatCurrency(model.hourlyRate)}
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Tallas
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {model.sizes.map((size) => (
                        <span
                          key={`${model.id}-${size}`}
                          className="app-badge bg-slate-200 text-slate-700"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Notas
                    </p>
                    <p className="mt-2 text-sm leading-7 text-foreground/72">
                      {model.notes ?? "Sin notas registradas"}
                    </p>
                  </div>
                  <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">
                      Atajos externos
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {model.folderUrl ? (
                        <a
                          href={model.folderUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="app-button-secondary"
                        >
                          Abrir {getFolderProviderLabel(model.folderProvider)}
                        </a>
                      ) : null}
                      {model.instagramPostUrl ? (
                        <a
                          href={model.instagramPostUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="app-button-secondary"
                        >
                          Abrir publicación
                        </a>
                      ) : null}
                      {!model.folderUrl && !model.instagramPostUrl ? (
                        <p className="text-sm leading-7 text-foreground/72">
                          Todavía no hay links externos registrados.
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="app-page">
            <div className="border-b border-line pb-4">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
                Sesiones y vestidos
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground sm:text-4xl">
                Resumen de trabajo
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              {model.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-[1.35rem] border border-line bg-surface px-4 py-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium text-foreground">
                      {assignment.dress?.name ?? "Vestido sin referencia"}
                    </p>
                    <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">
                      {assignment.assignmentStatus}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-1 text-sm leading-7 text-foreground/72">
                    <p>
                      Código: {assignment.dress?.internalCode ?? "Sin código"}
                    </p>
                    <p>
                      Talla del vestido: {assignment.dress?.size ?? "Sin talla"}
                    </p>
                    <p>Fecha: {formatDate(assignment.scheduledDate)}</p>
                    <p>Costo: {formatCurrency(assignment.costAgreed)}</p>
                    <p>{assignment.notes ?? "Sin notas adicionales"}</p>
                  </div>
                </div>
              ))}

              {model.assignments.length === 0 ? (
                <div className="rounded-[1.35rem] border border-dashed border-line bg-surface px-4 py-6 text-sm text-foreground/72">
                  Todavía no hay vestidos o sesiones registradas para esta
                  modelo.
                </div>
              ) : null}
            </div>
          </section>
        </>
      ) : (
        <section className="app-page">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Editar modelo
            </p>
            <h2 className="font-heading text-3xl text-foreground sm:text-4xl">
              Configuración de la ficha
            </h2>
          </div>

          <form
            action={updateModelAction}
            className="mt-6 grid gap-4 sm:grid-cols-2"
          >
            <input type="hidden" name="modelId" value={model.id} />
            <label className="grid gap-2 text-sm text-foreground/75">
              Nombre
              <input
                required
                name="name"
                defaultValue={model.name}
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Instagram
              <input
                name="instagramHandle"
                defaultValue={model.instagramHandle ?? ""}
                className="app-field"
              />
            </label>

            <label className="col-span-full grid gap-2 text-sm text-foreground/75">
              Link de foto
              <input
                name="photoUrl"
                type="url"
                defaultValue={model.photoUrl ?? ""}
                placeholder="https://... foto de la modelo"
                className="app-field"
              />
            </label>

            <label className="col-span-full grid gap-2 text-sm text-foreground/75">
              Link de publicación de Instagram
              <input
                name="instagramPostUrl"
                type="url"
                defaultValue={model.instagramPostUrl ?? ""}
                placeholder="https://instagram.com/p/..."
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Costo por hora
              <input
                type="number"
                step="0.01"
                name="hourlyRate"
                defaultValue={model.hourlyRate ?? ""}
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Costo por vestido
              <input
                type="number"
                step="0.01"
                name="perDressRate"
                defaultValue={model.perDressRate ?? ""}
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Tallas compatibles
              <input
                name="sizes"
                defaultValue={model.sizes.join(", ")}
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Disponibilidad
              <input
                name="availability"
                defaultValue={model.availability ?? ""}
                className="app-field"
              />
            </label>

            <label className="col-span-full grid gap-2 text-sm text-foreground/75">
              Notas
              <textarea
                name="notes"
                rows={5}
                defaultValue={model.notes ?? ""}
                className="app-field min-h-36 resize-y"
              />
            </label>

            <div className="col-span-full flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="app-button-primary">
                Guardar información
              </button>
              <Link
                href={`/modelos/${model.id}`}
                className="app-button-secondary"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}

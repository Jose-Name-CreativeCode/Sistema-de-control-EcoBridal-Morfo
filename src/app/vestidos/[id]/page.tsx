import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addDressInstagramPostAction,
  addDressPhotoAction,
  addDressPhotoFolderAction,
  assignModelToDressAction,
  updateDressStatusesAction,
} from "@/app/vestidos/actions";
import { getDressModelOptions } from "@/lib/models";
import {
  folderProviderLabels,
  getDressDetailData,
  getInstagramStatusBadgeClasses,
  getWorkflowStatusBadgeClasses,
  instagramPostTypeLabels,
  instagramStatusLabels,
  photoTypeLabels,
  photoTypeOptions,
  workflowStatusLabels,
} from "@/lib/dresses";

type DressDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    folderSaved?: string;
    instagramSaved?: string;
    photoSaved?: string;
    statusSaved?: string;
    assignmentSaved?: string;
    demo?: string;
  }>;
};

function formatDate(value: Date | null) {
  if (!value) return "Sin fecha";

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatCurrency(value: number | null) {
  if (value === null) return "Pendiente";

  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function DressDetailPage({
  params,
  searchParams,
}: DressDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const data = await getDressDetailData(id);

  if (!data) {
    notFound();
  }

  const { dress } = data;
  const modelOptions = await getDressModelOptions(dress.id, dress.size);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_20px_80px_rgba(64,34,24,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">Detalle de vestido</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
                {dress.name}
              </h1>
              <span className="rounded-full bg-stone-200 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-700">
                {dress.internalCode}
              </span>
              {dress.isNew ? (
                <span className="rounded-full bg-accent px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                  Nuevo
                </span>
              ) : null}
            </div>
            <p className="mt-4 text-lg leading-8 text-foreground/75">
              {dress.brand ?? "Marca pendiente"} · Talla {dress.size} ·{" "}
              {dress.color ?? "Color pendiente"} · Ingreso {formatDate(dress.receivedAt)}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/vestidos"
              className="rounded-full border border-line bg-white px-5 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
            >
              Volver al listado
            </Link>
            <Link
              href="/asignaciones"
              className="rounded-full bg-accent px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#6f3b28]"
            >
              Ver asignaciones
            </Link>
          </div>
        </div>

        {!data.databaseReady ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-accent/30 bg-accent/8 px-5 py-4 text-sm leading-7 text-foreground/78">
            Estás viendo este vestido en modo demo. Cuando PostgreSQL esté conectado,
            aquí aparecerán tus enlaces reales de carpetas editadas y publicaciones de Instagram.
          </div>
        ) : null}

        {query?.folderSaved === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            La carpeta externa se registró correctamente.
          </div>
        ) : null}

        {query?.instagramSaved === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            El enlace de Instagram se registró correctamente.
          </div>
        ) : null}

        {query?.photoSaved === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            La foto interna se registró correctamente.
          </div>
        ) : null}

        {query?.statusSaved === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            Los estados del vestido se actualizaron correctamente.
          </div>
        ) : null}

        {query?.assignmentSaved === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
            La asignación de modelo se registró correctamente.
          </div>
        ) : null}

        {query?.demo === "1" ? (
          <div className="mt-6 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            La acción no se guardó porque el proyecto sigue en modo demo.
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <article className="rounded-[1.35rem] border border-line bg-white/80 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">Fotografía</p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-2 text-sm font-medium ${getWorkflowStatusBadgeClasses(
                dress.workflowStatus,
              )}`}
            >
              {workflowStatusLabels[dress.workflowStatus]}
            </span>
          </article>
          <article className="rounded-[1.35rem] border border-line bg-white/80 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">Instagram</p>
            <span
              className={`mt-3 inline-flex rounded-full px-3 py-2 text-sm font-medium ${getInstagramStatusBadgeClasses(
                dress.instagramStatus,
              )}`}
            >
              {instagramStatusLabels[dress.instagramStatus]}
            </span>
          </article>
          <article className="rounded-[1.35rem] border border-line bg-white/80 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">Fotos</p>
            <p className="mt-3 font-heading text-5xl text-accent">{dress.photoCount}</p>
          </article>
          <article className="rounded-[1.35rem] border border-line bg-white/80 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">Precio</p>
            <p className="mt-3 font-heading text-4xl text-accent">
              {formatCurrency(dress.price)}
            </p>
          </article>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-line bg-white/80 p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Galería interna
            </p>
            <h2 className="font-heading text-4xl text-foreground">Fotos y video del sistema</h2>
          </div>
        </div>

        <form action={addDressPhotoAction} className="mt-6 grid gap-4">
          <input type="hidden" name="dressId" value={dress.id} />
          <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr_0.7fr]">
            <label className="grid gap-2 text-sm text-foreground/75">
              Tipo
              <select
                name="photoType"
                defaultValue="COVER"
                className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
              >
                {photoTypeOptions.map((photoType) => (
                  <option key={photoType} value={photoType}>
                    {photoTypeLabels[photoType]}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-foreground/75">
              URL de imagen o video
              <input
                required
                type="url"
                name="imageUrl"
                placeholder="https://..."
                className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
            <label className="grid gap-2 text-sm text-foreground/75">
              Orden
              <input
                type="number"
                name="sortOrder"
                placeholder="1"
                className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-foreground/75">
            Descripción corta
            <input
              name="altText"
              placeholder="Ejemplo: frente del vestido con luz natural."
              className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28] sm:w-auto"
          >
            Guardar foto interna
          </button>
        </form>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dress.photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-[1.35rem] border border-line bg-surface px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium text-foreground">{photoTypeLabels[photo.photoType]}</p>
                <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">
                  #{photo.sortOrder}
                </span>
              </div>
              <p className="mt-2 break-all text-sm leading-7 text-foreground/72">
                {photo.imageUrl}
              </p>
              <p className="text-sm leading-7 text-foreground/72">
                {photo.altText ?? "Sin descripción"}
              </p>
              <a
                href={photo.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-medium text-accent underline-offset-4 hover:underline"
              >
                Abrir archivo
              </a>
            </div>
          ))}

          {dress.photos.length === 0 ? (
            <div className="rounded-[1.35rem] border border-dashed border-line bg-surface px-4 py-6 text-sm text-foreground/72 md:col-span-2 xl:col-span-3">
              Todavía no hay fotos internas registradas para este vestido.
            </div>
          ) : null}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-line bg-white/80 p-6">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Control operativo
            </p>
            <h2 className="font-heading text-4xl text-foreground">Estados del vestido</h2>
          </div>
          <form action={updateDressStatusesAction} className="mt-6 grid gap-4">
            <input type="hidden" name="dressId" value={dress.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground/75">
                Estado de fotografía
                <select
                  name="workflowStatus"
                  defaultValue={dress.workflowStatus}
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                >
                  {Object.entries(workflowStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Estado de Instagram
                <select
                  name="instagramStatus"
                  defaultValue={dress.instagramStatus}
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                >
                  {Object.entries(instagramStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28] sm:w-auto"
            >
              Guardar estados
            </button>
          </form>
        </article>

        <article className="rounded-[2rem] border border-line bg-white/80 p-6">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Resumen operativo
            </p>
            <h2 className="font-heading text-4xl text-foreground">Datos del vestido</h2>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] bg-background p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">Condición</p>
              <p className="mt-2 text-sm text-foreground/78">{dress.condition}</p>
            </div>
            <div className="rounded-[1.25rem] bg-background p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">Talla</p>
              <p className="mt-2 text-sm text-foreground/78">{dress.size}</p>
            </div>
            <div className="rounded-[1.25rem] bg-background p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">Marca</p>
              <p className="mt-2 text-sm text-foreground/78">{dress.brand ?? "Pendiente"}</p>
            </div>
            <div className="rounded-[1.25rem] bg-background p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">Color</p>
              <p className="mt-2 text-sm text-foreground/78">{dress.color ?? "Pendiente"}</p>
            </div>
            <div className="rounded-[1.25rem] bg-background p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-foreground/55">Notas</p>
              <p className="mt-2 text-sm leading-7 text-foreground/78">
                {dress.notes ?? "Todavía no hay notas internas para este vestido."}
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-line bg-surface-strong p-6">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Atajos rápidos
            </p>
            <h2 className="font-heading text-4xl text-foreground">Comprobación externa</h2>
          </div>
          <div className="mt-6 grid gap-4">
            <a
              href={dress.photoFolders[0]?.folderUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-[1.3rem] border px-5 py-4 text-sm font-medium transition ${
                dress.photoFolders[0]
                  ? "border-line bg-white text-foreground hover:bg-background"
                  : "cursor-not-allowed border-dashed border-line bg-white/60 text-foreground/45"
              }`}
            >
              {dress.photoFolders[0]
                ? "Abrir carpeta editada más reciente"
                : "Todavía no hay carpeta enlazada"}
            </a>
            <a
              href={dress.instagramPosts[0]?.instagramUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-[1.3rem] border px-5 py-4 text-sm font-medium transition ${
                dress.instagramPosts[0]
                  ? "border-line bg-white text-foreground hover:bg-background"
                  : "cursor-not-allowed border-dashed border-line bg-white/60 text-foreground/45"
              }`}
            >
              {dress.instagramPosts[0]
                ? "Abrir publicación más reciente en Instagram"
                : "Todavía no hay publicación enlazada"}
            </a>
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-line bg-white/80 p-6">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Asignación de modelo
            </p>
            <h2 className="font-heading text-4xl text-foreground">Modelos compatibles</h2>
          </div>

          <form action={assignModelToDressAction} className="mt-6 grid gap-4">
            <input type="hidden" name="dressId" value={dress.id} />
            <label className="grid gap-2 text-sm text-foreground/75">
              Modelo
              <select
                name="modelId"
                className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                defaultValue={modelOptions.compatibleModels[0]?.id ?? ""}
              >
                <option value="">Selecciona una modelo</option>
                {modelOptions.compatibleModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} · tallas {model.sizes.join(", ")}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm text-foreground/75">
                Estado
                <select
                  name="assignmentStatus"
                  defaultValue="SUGGESTED"
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                >
                  <option value="SUGGESTED">Sugerida</option>
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="COMPLETED">Completada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Fecha programada
                <input
                  type="date"
                  name="scheduledDate"
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Costo acordado
                <input
                  type="number"
                  step="0.01"
                  name="costAgreed"
                  placeholder="180"
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-foreground/75">
              Notas de asignación
              <textarea
                name="notes"
                rows={3}
                placeholder="Motivo de selección, horario o detalles de fitting."
                className="rounded-3xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28] sm:w-auto"
            >
              Guardar asignación
            </button>
          </form>
        </article>

        <article className="rounded-[2rem] border border-line bg-white/80 p-6">
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Historial de asignaciones
            </p>
            <h2 className="font-heading text-4xl text-foreground">Sesiones y modelos</h2>
          </div>
          <div className="mt-6 grid gap-4">
            {modelOptions.assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-[1.35rem] border border-line bg-surface px-4 py-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium text-foreground">
                    {assignment.model?.name ?? "Modelo sin asignar"}
                  </p>
                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">
                    {assignment.assignmentStatus}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-foreground/72">
                  Fecha: {formatDate(assignment.scheduledDate)} · Costo:{" "}
                  {formatCurrency(assignment.costAgreed)}
                </p>
                <p className="text-sm leading-7 text-foreground/72">
                  {assignment.notes ?? "Sin notas adicionales"}
                </p>
              </div>
            ))}
            {modelOptions.assignments.length === 0 ? (
              <div className="rounded-[1.35rem] border border-dashed border-line bg-surface px-4 py-6 text-sm text-foreground/72">
                Todavía no hay asignaciones registradas para este vestido.
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-[2rem] border border-line bg-white/80 p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
                Carpetas externas
              </p>
              <h2 className="font-heading text-4xl text-foreground">Fotos editadas</h2>
            </div>
          </div>

          <form action={addDressPhotoFolderAction} className="mt-6 grid gap-4">
            <input type="hidden" name="dressId" value={dress.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground/75">
                Proveedor
                <select
                  name="provider"
                  defaultValue="OUTLOOK_ONEDRIVE"
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                >
                  {Object.entries(folderProviderLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Versión o etiqueta
                <input
                  name="versionLabel"
                  placeholder="Edición final mayo"
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-foreground/75">
              Link de carpeta
              <input
                required
                type="url"
                name="folderUrl"
                placeholder="https://..."
                className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
            <label className="grid gap-2 text-sm text-foreground/75">
              Notas
              <textarea
                name="notes"
                rows={3}
                placeholder="Qué incluye la carpeta o qué versión está aprobada."
                className="rounded-3xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28] sm:w-auto"
            >
              Guardar carpeta externa
            </button>
          </form>

          <div className="mt-6 grid gap-4">
            {dress.photoFolders.map((folder) => (
              <div
                key={folder.id}
                className="rounded-[1.35rem] border border-line bg-surface px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {folderProviderLabels[folder.provider]}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground/55">
                      {folder.versionLabel ?? "Sin versión"}
                    </p>
                  </div>
                  <a
                    href={folder.folderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-accent px-4 py-2 text-sm text-white"
                  >
                    Abrir
                  </a>
                </div>
                <p className="mt-3 text-sm leading-7 text-foreground/72">
                  {folder.notes ?? "Sin notas adicionales"}
                </p>
              </div>
            ))}

            {dress.photoFolders.length === 0 ? (
              <div className="rounded-[1.35rem] border border-dashed border-line bg-surface px-4 py-6 text-sm text-foreground/72">
                Todavía no hay carpetas externas registradas para este vestido.
              </div>
            ) : null}
          </div>
        </article>

        <article className="rounded-[2rem] border border-line bg-white/80 p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
                Publicaciones
              </p>
              <h2 className="font-heading text-4xl text-foreground">Instagram</h2>
            </div>
          </div>

          <form action={addDressInstagramPostAction} className="mt-6 grid gap-4">
            <input type="hidden" name="dressId" value={dress.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm text-foreground/75">
                Tipo de publicación
                <select
                  name="postType"
                  defaultValue="POST"
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                >
                  {Object.entries(instagramPostTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Cuenta de Instagram
                <input
                  name="accountName"
                  placeholder="@ecobridalmorfo"
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-foreground/75">
              Link de publicación
              <input
                required
                type="url"
                name="instagramUrl"
                placeholder="https://instagram.com/..."
                className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
              <label className="grid gap-2 text-sm text-foreground/75">
                Fecha de publicación
                <input
                  type="date"
                  name="publishedAt"
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
              <label className="grid gap-2 text-sm text-foreground/75">
                Notas
                <input
                  name="captionNotes"
                  placeholder="Caption, formato o comentario interno."
                  className="rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6f3b28] sm:w-auto"
            >
              Guardar publicación de Instagram
            </button>
          </form>

          <div className="mt-6 grid gap-4">
            {dress.instagramPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-[1.35rem] border border-line bg-surface px-4 py-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {instagramPostTypeLabels[post.postType]}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-foreground/55">
                      {post.accountName ?? "Cuenta pendiente"} · {formatDate(post.publishedAt)}
                    </p>
                  </div>
                  <a
                    href={post.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-accent px-4 py-2 text-sm text-white"
                  >
                    Abrir
                  </a>
                </div>
                <p className="mt-3 text-sm leading-7 text-foreground/72">
                  {post.captionNotes ?? "Sin notas de caption"}
                </p>
              </div>
            ))}

            {dress.instagramPosts.length === 0 ? (
              <div className="rounded-[1.35rem] border border-dashed border-line bg-surface px-4 py-6 text-sm text-foreground/72">
                Todavía no hay publicaciones de Instagram registradas para este vestido.
              </div>
            ) : null}
          </div>
        </article>
      </section>
    </main>
  );
}

"use client";

import { useState } from "react";

type DressMediaCardProps = {
  dressId: string;
  photo: {
    id: string;
    photoType: string;
    imageUrl: string;
    altText: string | null;
    sortOrder: number;
  };
  photoTypeOptions: Array<{
    value: string;
    label: string;
  }>;
  photoTypeLabel: string;
  action: (formData: FormData) => void | Promise<void>;
};

function isVideoAsset(source: string, photoType: string) {
  if (photoType === "VIDEO") {
    return true;
  }

  return source.startsWith("data:video/") || /\.(mp4|mov|webm|ogg)$/i.test(source);
}

export function DressMediaCard({
  dressId,
  photo,
  photoTypeOptions,
  photoTypeLabel,
  action,
}: DressMediaCardProps) {
  const [mediaDataUrl, setMediaDataUrl] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "video">(
    isVideoAsset(photo.imageUrl, photo.photoType) ? "video" : "image",
  );
  const [fileName, setFileName] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setMediaDataUrl("");
      setPreviewType(isVideoAsset(photo.imageUrl, photo.photoType) ? "video" : "image");
      setFileName("");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
      reader.readAsDataURL(file);
    });

    setMediaDataUrl(dataUrl);
    setPreviewType(file.type.startsWith("video/") ? "video" : "image");
    setFileName(file.name);
  }

  const currentPreview = mediaDataUrl || photo.imageUrl;
  const externalUrlValue = photo.imageUrl.startsWith("data:") ? "" : photo.imageUrl;

  return (
    <div className="rounded-[1.35rem] border border-line bg-surface px-4 py-4">
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {previewType === "video" ? (
          <video
            src={currentPreview}
            controls
            className="h-64 w-full bg-black object-contain"
          />
        ) : (
          <img
            src={currentPreview}
            alt={photo.altText ?? `Foto ${photoTypeLabel}`}
            className="h-64 w-full object-cover"
          />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-medium text-foreground">{photoTypeLabel}</p>
        <span className="rounded-full bg-stone-200 px-3 py-1 text-xs text-stone-700">
          #{photo.sortOrder}
        </span>
      </div>

      <form action={action} className="mt-4 grid gap-3">
        <input type="hidden" name="dressId" value={dressId} />
        <input type="hidden" name="photoId" value={photo.id} />
        <input type="hidden" name="imageDataUrl" value={mediaDataUrl} />

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-sm text-foreground/75">
            Tipo
            <select
              name="photoType"
              defaultValue={photo.photoType}
              className="app-field"
            >
              {photoTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-foreground/75">
            Orden
            <input
              type="number"
              name="sortOrder"
              defaultValue={photo.sortOrder}
              className="app-field"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm text-foreground/75">
          Reemplazar archivo
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="rounded-2xl border border-dashed border-line bg-white px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-accent"
          />
          <span className="text-xs leading-5 text-foreground/55">
            {fileName ? `Nuevo archivo listo: ${fileName}` : "Opcional. Solo selecciónalo si quieres cambiar la foto o video."}
          </span>
        </label>

        <label className="grid gap-2 text-sm text-foreground/75">
          Link externo
          <input
            type="url"
            name="imageUrl"
            defaultValue={externalUrlValue}
            placeholder="https://... (opcional)"
            className="app-field"
          />
          <span className="text-xs leading-5 text-foreground/55">
            Si esta foto vino de un enlace externo, aquí puedes actualizarlo.
          </span>
        </label>

        <label className="grid gap-2 text-sm text-foreground/75">
          Descripción corta
          <input
            name="altText"
            defaultValue={photo.altText ?? ""}
            placeholder="Ejemplo: frente del vestido con luz natural."
            className="app-field"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="app-button-primary">
            Guardar cambios de foto
          </button>
          <a
            href={photo.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="app-button-secondary"
          >
            Abrir archivo
          </a>
        </div>
      </form>
    </div>
  );
}

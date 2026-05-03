"use client";

import { useState } from "react";

type DressMediaUploadFormProps = {
  dressId: string;
  action: (formData: FormData) => void | Promise<void>;
  photoTypeOptions: Array<{
    value: string;
    label: string;
  }>;
};

export function DressMediaUploadForm({
  dressId,
  action,
  photoTypeOptions,
}: DressMediaUploadFormProps) {
  const [mediaDataUrl, setMediaDataUrl] = useState("");
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(null);
  const [fileName, setFileName] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setMediaDataUrl("");
      setPreviewType(null);
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

  return (
    <form action={action} className="mt-6 grid gap-4">
      <input type="hidden" name="dressId" value={dressId} />
      <input type="hidden" name="imageDataUrl" value={mediaDataUrl} />

      <div className="grid gap-4 sm:grid-cols-[1fr_0.7fr]">
        <label className="grid gap-2 text-sm text-foreground/75">
          Tipo
          <select
            name="photoType"
            defaultValue="COVER"
            className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
          >
            {photoTypeOptions.map((photoType) => (
              <option key={photoType.value} value={photoType.value}>
                {photoType.label}
              </option>
            ))}
          </select>
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
        Foto o video
        <input
          required
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="rounded-2xl border border-dashed border-line bg-surface px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-accent"
        />
        <span className="text-xs leading-5 text-foreground/55">
          {fileName ? `Archivo listo: ${fileName}` : "Selecciona una imagen o video desde tu computadora."}
        </span>
      </label>

      {mediaDataUrl ? (
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-foreground/55">
            Vista previa
          </p>
          {previewType === "video" ? (
            <video src={mediaDataUrl} controls className="mt-3 max-h-80 w-full rounded-xl bg-black object-contain" />
          ) : (
            <img
              src={mediaDataUrl}
              alt="Vista previa de foto interna"
              className="mt-3 max-h-80 w-full rounded-xl bg-white object-contain"
            />
          )}
        </div>
      ) : null}

      <label className="grid gap-2 text-sm text-foreground/75">
        Descripción corta
        <input
          name="altText"
          placeholder="Ejemplo: frente del vestido con luz natural."
          className="rounded-2xl border border-line bg-surface px-4 py-3 outline-none transition focus:border-accent"
        />
      </label>

      <button type="submit" className="app-button-primary w-full sm:w-auto">
        Guardar foto interna
      </button>
    </form>
  );
}

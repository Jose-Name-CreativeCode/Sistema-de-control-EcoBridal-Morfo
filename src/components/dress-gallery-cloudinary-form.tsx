"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

type GallerySlot = {
  field: "coverUrl" | "frontUrl" | "backUrl" | "detailUrl";
  label: string;
  helper: string;
};

type DressGalleryCloudinaryFormProps = {
  dressId: string;
  dressCode: string;
  dressName: string;
  action: (formData: FormData) => void | Promise<void>;
  initialPhotos: Record<GallerySlot["field"], string>;
};

type SlotState = {
  url: string;
  fileName: string;
  uploading: boolean;
  error: string;
};

const slots: GallerySlot[] = [
  {
    field: "coverUrl",
    label: "Cuerpo completo",
    helper: "Foto principal del vestido completo.",
  },
  {
    field: "frontUrl",
    label: "Medio cuerpo",
    helper: "Foto desde la cintura o pecho hacia arriba.",
  },
  {
    field: "backUrl",
    label: "Espalda",
    helper: "Vista trasera del vestido.",
  },
  {
    field: "detailUrl",
    label: "Detalle",
    helper: "Encaje, textura o detalle importante.",
  },
];

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() ?? "";
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() ?? "";

function buildInitialState(initialPhotos: Record<GallerySlot["field"], string>) {
  return slots.reduce(
    (accumulator, slot) => {
      accumulator[slot.field] = {
        url: initialPhotos[slot.field] ?? "",
        fileName: "",
        uploading: false,
        error: "",
      };
      return accumulator;
    },
    {} as Record<GallerySlot["field"], SlotState>,
  );
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function DressGalleryCloudinaryForm({
  dressId,
  dressCode,
  dressName,
  action,
  initialPhotos,
}: DressGalleryCloudinaryFormProps) {
  const [slotState, setSlotState] = useState(() => buildInitialState(initialPhotos));

  const cloudinaryReady = Boolean(cloudName && uploadPreset);
  const isUploading = useMemo(
    () => Object.values(slotState).some((slot) => slot.uploading),
    [slotState],
  );

  async function handleFileChange(
    slot: GallerySlot,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!cloudinaryReady) {
      setSlotState((current) => ({
        ...current,
        [slot.field]: {
          ...current[slot.field],
          error: "Falta configurar Cloudinary para subir directo desde el sistema.",
        },
      }));
      return;
    }

    setSlotState((current) => ({
      ...current,
      [slot.field]: {
        ...current[slot.field],
        fileName: file.name,
        uploading: true,
        error: "",
      },
    }));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append(
        "folder",
        `ecobridal/vestidos/${slugify(dressCode || dressName || dressId)}`,
      );
      formData.append(
        "public_id",
        `${slot.field}-${Date.now()}`,
      );

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const payload = (await response.json()) as {
        secure_url?: string;
        error?: { message?: string };
      };

      if (!response.ok || !payload.secure_url) {
        throw new Error(payload.error?.message ?? "No se pudo subir la foto a Cloudinary.");
      }

      setSlotState((current) => ({
        ...current,
        [slot.field]: {
          ...current[slot.field],
          url: payload.secure_url ?? "",
          uploading: false,
          error: "",
        },
      }));
    } catch (error) {
      setSlotState((current) => ({
        ...current,
        [slot.field]: {
          ...current[slot.field],
          uploading: false,
          error: error instanceof Error ? error.message : "No se pudo subir la foto.",
        },
      }));
    } finally {
      event.target.value = "";
    }
  }

  function clearSlot(slot: GallerySlot) {
    setSlotState((current) => ({
      ...current,
      [slot.field]: {
        url: "",
        fileName: "",
        uploading: false,
        error: "",
      },
    }));
  }

  return (
    <form action={action} className="mt-6 grid gap-5">
      <input type="hidden" name="dressId" value={dressId} />

      <div className="rounded-2xl border border-line bg-surface px-4 py-4 text-sm leading-7 text-foreground/72">
        Elige las 4 fotos desde aquí y el sistema las sube a Cloudinary por ti. Después
        solo guardas una vez.
      </div>

      {!cloudinaryReady ? (
        <div className="rounded-2xl border border-support-coral/25 bg-support-coral/10 px-4 py-4 text-sm leading-7 text-foreground">
          Falta configurar `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` y
          `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Mientras tanto, puedes usar el modo manual
          que está abajo.
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {slots.map((slot) => {
          const current = slotState[slot.field];

          return (
            <div
              key={slot.field}
              className="rounded-[1.35rem] border border-line bg-[rgba(250,248,244,0.98)] p-4 shadow-[0_10px_28px_rgba(25,28,38,0.05)]"
            >
              <input type="hidden" name={slot.field} value={current.url} />

              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">{slot.label}</p>
                  <p className="mt-1 text-sm leading-6 text-foreground/68">{slot.helper}</p>
                </div>
                {current.uploading ? (
                  <span className="app-badge bg-amber-100 text-amber-800">Subiendo</span>
                ) : current.url ? (
                  <span className="app-badge bg-emerald-100 text-emerald-800">Lista</span>
                ) : (
                  <span className="app-badge bg-stone-200 text-stone-700">Pendiente</span>
                )}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-line bg-white">
                {current.url ? (
                  <img
                    src={current.url}
                    alt={slot.label}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-[rgba(235,229,220,0.55)] px-6 text-center text-sm leading-6 text-foreground/55">
                    Todavía no has elegido esta foto.
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3">
                <label className="grid gap-2 text-sm text-foreground/75">
                  Elegir imagen
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleFileChange(slot, event)}
                    className="rounded-2xl border border-dashed border-line bg-white px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-accent"
                  />
                </label>

                {current.fileName ? (
                  <p className="text-xs leading-5 text-foreground/55">
                    Archivo elegido: {current.fileName}
                  </p>
                ) : null}

                {current.error ? (
                  <p className="rounded-xl border border-support-coral/20 bg-support-coral/8 px-3 py-2 text-xs leading-5 text-support-coral">
                    {current.error}
                  </p>
                ) : null}

                {current.url ? (
                  <button
                    type="button"
                    onClick={() => clearSlot(slot)}
                    className="app-button-secondary w-full sm:w-auto"
                  >
                    Quitar esta foto
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isUploading}
          className="app-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isUploading ? "Espera a que terminen de subir" : "Guardar galería del vestido"}
        </button>
      </div>

      <details className="rounded-2xl border border-line bg-surface px-4 py-4">
        <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
          Modo manual de respaldo
        </summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {slots.map((slot) => (
            <label key={`${slot.field}-manual`} className="grid gap-2 text-sm text-foreground/75">
              {slot.label}
              <input
                type="url"
                value={slotState[slot.field].url}
                onChange={(event) =>
                  setSlotState((current) => ({
                    ...current,
                    [slot.field]: {
                      ...current[slot.field],
                      url: event.target.value,
                      error: "",
                    },
                  }))
                }
                placeholder="https://..."
                className="app-field"
              />
            </label>
          ))}
        </div>
      </details>
    </form>
  );
}

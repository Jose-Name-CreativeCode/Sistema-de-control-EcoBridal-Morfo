"use client";

import { useEffect, useRef, useState } from "react";

type PoseItem = {
  id: string;
  title: string;
  size: string;
  notes: string;
  imageUrl: string;
};

const STORAGE_KEY = "ecobridal-pose-library";
const sizes = ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20"] as const;

function readPoses(): PoseItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PoseItem[]) : [];
  } catch {
    return [];
  }
}

function savePoses(items: PoseItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function PoseLibraryManager() {
  const formSectionRef = useRef<HTMLElement | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const [poses, setPoses] = useState<PoseItem[]>(() => readPoses());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterSize, setFilterSize] = useState("");
  const [title, setTitle] = useState("");
  const [size, setSize] = useState("8");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [zoomedPose, setZoomedPose] = useState<PoseItem | null>(null);

  const filteredPoses = filterSize ? poses.filter((item) => item.size === filterSize) : poses;

  const zoomedPoseIndex = zoomedPose
    ? filteredPoses.findIndex((item) => item.id === zoomedPose.id)
    : -1;

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setSize("8");
    setNotes("");
    setImageUrl("");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!title.trim() || !imageUrl.trim()) {
      return;
    }

    const nextPose: PoseItem = {
      id: editingId ?? crypto.randomUUID(),
      title: title.trim(),
      size,
      notes: notes.trim(),
      imageUrl: imageUrl.trim(),
    };

    const nextPoses = editingId
      ? poses.map((item) => (item.id === editingId ? nextPose : item))
      : [nextPose, ...poses];

    setPoses(nextPoses);
    savePoses(nextPoses);
    resetForm();
  }

  function handleEdit(item: PoseItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setSize(item.size);
    setNotes(item.notes);
    setImageUrl(item.imageUrl);
    formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      titleInputRef.current?.focus();
    }, 180);
  }

  function handleDelete(id: string) {
    const nextPoses = poses.filter((item) => item.id !== id);
    setPoses(nextPoses);
    savePoses(nextPoses);
    if (editingId === id) resetForm();
    if (zoomedPose?.id === id) setZoomedPose(null);
  }

  function handlePrevPose() {
    if (!filteredPoses.length || zoomedPoseIndex === -1) return;
    const nextIndex =
      zoomedPoseIndex === 0 ? filteredPoses.length - 1 : zoomedPoseIndex - 1;
    setZoomedPose(filteredPoses[nextIndex]);
  }

  function handleNextPose() {
    if (!filteredPoses.length || zoomedPoseIndex === -1) return;
    const nextIndex =
      zoomedPoseIndex === filteredPoses.length - 1 ? 0 : zoomedPoseIndex + 1;
    setZoomedPose(filteredPoses[nextIndex]);
  }

  useEffect(() => {
    if (!zoomedPose) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setZoomedPose(null);
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (!filteredPoses.length || zoomedPoseIndex === -1) return;
        const nextIndex =
          zoomedPoseIndex === 0 ? filteredPoses.length - 1 : zoomedPoseIndex - 1;
        setZoomedPose(filteredPoses[nextIndex]);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (!filteredPoses.length || zoomedPoseIndex === -1) return;
        const nextIndex =
          zoomedPoseIndex === filteredPoses.length - 1 ? 0 : zoomedPoseIndex + 1;
        setZoomedPose(filteredPoses[nextIndex]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomedPose, zoomedPoseIndex, filteredPoses]);

  return (
    <main className="flex w-full flex-1 flex-col gap-6">
      <section className="app-page">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-accent-strong">Poses</p>
            <h1 className="mt-3 font-heading text-5xl leading-[0.95] text-foreground sm:text-6xl">
              Biblioteca de poses por talla
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-foreground/78">
              Guarda referencias de poses de modelos por talla para tenerlas a la mano
              cuando prepares sesiones y pruebas.
            </p>
          </div>
        </div>
      </section>

      <section ref={formSectionRef} className="app-page">
        <article>
          <div className="border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              {editingId ? "Editar pose" : "Agregar pose"}
            </p>
            <h2 className="mt-2 font-heading text-4xl leading-none text-foreground">
              Registro visual
            </h2>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="grid gap-2 text-sm text-foreground/75 lg:col-span-2">
              Nombre o referencia
              <input
                ref={titleInputRef}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Pose espalda elegante"
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Talla
              <select value={size} onChange={(event) => setSize(event.target.value)} className="app-field">
                {sizes.map((entry) => (
                  <option key={entry} value={entry}>
                    Talla {entry}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Subir imagen
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="rounded-2xl border border-line bg-white px-4 py-3 text-sm"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75 lg:col-span-2">
              O pegar link de imagen
              <input
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://... pose modelo"
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75 lg:col-span-2">
              Notas
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="Qué tipo de cuerpo favorece o qué pose es."
                className="app-field min-h-32 resize-y"
              />
            </label>

            <div className="flex flex-wrap gap-3 lg:col-span-2">
              <button type="button" onClick={handleSave} className="app-button-primary">
                {editingId ? "Guardar cambio" : "Guardar pose"}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className="app-button-secondary">
                  Cancelar
                </button>
              ) : null}
            </div>
          </div>
        </article>
      </section>

      <section className="app-page">
        <article>
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Visualizar</p>
              <h2 className="mt-2 font-heading text-4xl leading-none text-foreground">
                Poses guardadas
              </h2>
            </div>
            <select
              value={filterSize}
              onChange={(event) => setFilterSize(event.target.value)}
              className="app-field w-[180px]"
            >
              <option value="">Todas las tallas</option>
              {sizes.map((entry) => (
                <option key={entry} value={entry}>
                  Talla {entry}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPoses.map((pose) => (
              <article key={pose.id} className="app-card overflow-hidden">
                <div className="flex min-h-[26rem] items-center justify-center overflow-hidden bg-[linear-gradient(180deg,rgba(239,241,250,0.95),rgba(232,227,221,0.92))] p-6">
                  <button
                    type="button"
                    onClick={() => setZoomedPose(pose)}
                    className="flex w-full items-center justify-center"
                  >
                    <img
                      src={pose.imageUrl}
                      alt={pose.title}
                      className="max-h-[22rem] w-full rounded-[1.2rem] object-contain shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition duration-200 hover:scale-[1.01]"
                    />
                  </button>
                </div>
                <div className="grid gap-4 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-heading text-2xl leading-none text-foreground">{pose.title}</p>
                    <span className="app-badge bg-slate-200 text-slate-700">Talla {pose.size}</span>
                  </div>
                  <p className="text-sm leading-7 text-foreground/72">{pose.notes || "Sin notas"}</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(pose)}
                      className="app-button-secondary"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(pose.id)}
                      className="rounded-xl border border-support-coral/30 px-4 py-3 text-sm font-medium text-support-coral transition hover:bg-support-coral hover:text-white"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {filteredPoses.length === 0 ? (
              <div className="rounded-[1.35rem] border border-dashed border-line bg-surface px-4 py-6 text-sm text-foreground/72">
                Todavía no hay poses guardadas para este filtro.
              </div>
            ) : null}
          </div>
        </article>
      </section>

      {zoomedPose ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/78 px-6 py-10"
          role="dialog"
          aria-modal="true"
          aria-label={`Vista ampliada de ${zoomedPose.title}`}
          onClick={() => setZoomedPose(null)}
        >
          <div
            className="relative flex max-h-full w-full max-w-6xl flex-col gap-4 rounded-[1.8rem] bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
              <div>
                <p className="font-heading text-3xl leading-none text-foreground">
                  {zoomedPose.title}
                </p>
                <p className="mt-2 text-sm text-foreground/68">
                  Talla {zoomedPose.size}
                  {zoomedPose.notes ? ` · ${zoomedPose.notes}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomedPose(null)}
                className="app-button-secondary"
              >
                Cerrar
              </button>
            </div>

            <div className="flex min-h-[65vh] items-center justify-center overflow-auto rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(239,241,250,0.95),rgba(232,227,221,0.92))] p-6">
              <div className="flex w-full items-center justify-center gap-4">
                {filteredPoses.length > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevPose}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white text-2xl text-foreground transition hover:bg-foreground hover:text-white"
                    aria-label="Ver pose anterior"
                  >
                    ←
                  </button>
                ) : null}

                <img
                  src={zoomedPose.imageUrl}
                  alt={zoomedPose.title}
                  className="max-h-[75vh] w-full rounded-[1.25rem] object-contain"
                />

                {filteredPoses.length > 1 ? (
                  <button
                    type="button"
                    onClick={handleNextPose}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-white text-2xl text-foreground transition hover:bg-foreground hover:text-white"
                    aria-label="Ver pose siguiente"
                  >
                    →
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

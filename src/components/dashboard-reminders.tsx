"use client";

import { useRef, useState } from "react";

type ReminderItem = {
  id: string;
  title: string;
  date: string;
  notes: string;
};

const STORAGE_KEY = "ecobridal-dashboard-reminders";

function readReminders(): ReminderItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ReminderItem[]) : [];
  } catch {
    return [];
  }
}

function saveReminders(items: ReminderItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function isOverdue(date: string) {
  if (!date) return false;

  const today = new Date();
  const todayKey = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  )
    .toISOString()
    .slice(0, 10);

  return date < todayKey;
}

export function DashboardReminders() {
  const [reminders, setReminders] = useState<ReminderItem[]>(() => readReminders());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  function openDatePicker() {
    const input = dateInputRef.current;
    if (!input) {
      return;
    }

    input.focus();
    input.showPicker?.();
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDate("");
    setNotes("");
  }

  function handleSave() {
    if (!title.trim()) {
      return;
    }

    const nextItem: ReminderItem = {
      id: editingId ?? crypto.randomUUID(),
      title: title.trim(),
      date,
      notes: notes.trim(),
    };

    const nextReminders = editingId
      ? reminders.map((item) => (item.id === editingId ? nextItem : item))
      : [nextItem, ...reminders];

    setReminders(nextReminders);
    saveReminders(nextReminders);
    resetForm();
  }

  function handleEdit(item: ReminderItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setDate(item.date);
    setNotes(item.notes);
  }

  function handleDelete(id: string) {
    const nextReminders = reminders.filter((item) => item.id !== id);
    setReminders(nextReminders);
    saveReminders(nextReminders);

    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <section className="app-page">
      <div className="border-b border-line pb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">Recordatorios</p>
        <h2 className="mt-2 font-heading text-3xl leading-none text-foreground sm:text-4xl">
          Agenda rápida
        </h2>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[1.6rem] border border-line bg-surface p-5">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-foreground/75">
              Título
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Recordar a la modelo..."
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Fecha
              <input
                ref={dateInputRef}
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                onClick={openDatePicker}
                onFocus={openDatePicker}
                className="app-field"
              />
            </label>

            <label className="grid gap-2 text-sm text-foreground/75">
              Notas
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={4}
                placeholder="Ejemplo: recordar que traiga blusa nude."
                className="app-field min-h-32 resize-y"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={handleSave} className="app-button-primary">
                {editingId ? "Guardar cambio" : "Agregar recordatorio"}
              </button>
              {editingId ? (
                <button type="button" onClick={resetForm} className="app-button-secondary">
                  Cancelar
                </button>
              ) : null}
            </div>
          </div>
        </article>

        <article className="rounded-[1.6rem] border border-line bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
              Tus recordatorios
            </p>
            <span className="app-badge bg-slate-200 text-slate-700">{reminders.length}</span>
          </div>

          <div
            className={`mt-5 grid gap-4 ${
              reminders.length > 2 ? "max-h-[22rem] overflow-y-auto pr-1" : ""
            }`}
          >
            {reminders.map((item) => (
              <div
                key={item.id}
                className={`rounded-[1.2rem] border px-4 py-4 ${
                  isOverdue(item.date)
                    ? "border-support-coral/35 bg-support-coral/8"
                    : "border-line bg-white"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`font-medium ${
                        isOverdue(item.date) ? "text-support-coral" : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`mt-1 text-sm ${
                        isOverdue(item.date)
                          ? "text-support-coral/80"
                          : "text-foreground/72"
                      }`}
                    >
                      {item.date || "Sin fecha"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="text-sm font-medium text-accent underline-offset-4 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-sm font-medium text-support-coral underline-offset-4 hover:underline"
                    >
                      Borrar
                    </button>
                  </div>
                </div>
                <p
                  className={`mt-3 text-sm leading-7 ${
                    isOverdue(item.date) ? "text-support-coral/85" : "text-foreground/72"
                  }`}
                >
                  {item.notes || "Sin notas"}
                </p>
              </div>
            ))}

            {reminders.length === 0 ? (
              <div className="rounded-[1.2rem] border border-dashed border-line bg-white px-4 py-6 text-sm text-foreground/72">
                Todavía no hay recordatorios guardados.
              </div>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}

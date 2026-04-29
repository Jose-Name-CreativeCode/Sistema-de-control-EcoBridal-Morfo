import Link from "next/link";

const summaryCards = [
  { label: "Vestidos totales", value: "104", note: "Catálogo activo" },
  { label: "Pendientes de foto", value: "10", note: "Listos para programar" },
  { label: "Publicados en Instagram", value: "94", note: "Con evidencia enlazada" },
];

const workflowSteps = [
  "Registrar vestido con marca, talla, estado y notas.",
  "Asignar modelo compatible y guardar costo por vestido u hora.",
  "Subir fotos de referencia al sistema.",
  "Pegar el link de la carpeta editada en Outlook o OneDrive.",
  "Guardar el link del post o reel de Instagram para comprobar la publicacion.",
];

const modules = [
  {
    title: "Vestidos",
    body: "Inventario, tallas, marca, estado y filtro rapido para localizar cualquier pieza.",
  },
  {
    title: "Modelos",
    body: "Compatibilidad por talla, costos y asignaciones para cada sesion.",
  },
  {
    title: "Fotografia",
    body: "Control de pendientes, galeria, fotos clave y enlaces a carpetas editadas.",
  },
  {
    title: "Instagram",
    body: "Registro del post, reel o carrusel con boton directo para abrir la publicacion.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-12 pt-6 sm:px-10 lg:px-12">
      <section className="overflow-hidden rounded-[2rem] border border-line bg-surface shadow-[0_20px_80px_rgba(64,34,24,0.08)]">
        <div className="grid gap-10 px-6 py-8 sm:px-10 lg:grid-cols-[1.3fr_0.7fr] lg:px-12 lg:py-12">
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-accent">
                  EcoBridal Morfo
                </p>
                <h1 className="font-heading text-5xl leading-none text-foreground sm:text-6xl">
                  Control total de vestidos, fotos y publicaciones.
                </h1>
              </div>
              <div className="hidden rounded-full border border-line bg-white/70 px-4 py-2 text-sm text-foreground/70 md:block">
                Version inicial
              </div>
            </div>

            <p className="max-w-2xl text-lg leading-8 text-foreground/78">
              Esta base ya nace pensada para tu flujo real: buscar vestidos por talla y
              marca, asignar modelos compatibles, saber que piezas faltan por fotografiar,
              guardar el link de la carpeta editada y abrir el post de Instagram del vestido
              cuando haga falta comprobarlo.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
              {summaryCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-[1.5rem] border border-line bg-white/80 p-5"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                    {card.label}
                  </p>
                  <p className="mt-3 font-heading text-5xl text-accent">{card.value}</p>
                  <p className="mt-2 text-sm text-foreground/70">{card.note}</p>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/vestidos"
                className="rounded-full bg-accent px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-[#6f3b28]"
              >
                Abrir módulo de vestidos
              </Link>
              <Link
                href="/vestidos/nuevo"
                className="rounded-full border border-line bg-white px-6 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
              >
                Registrar nuevo vestido
              </Link>
              <Link
                href="/modelos"
                className="rounded-full border border-line bg-white px-6 py-3 text-center text-sm font-medium text-foreground transition hover:bg-background"
              >
                Abrir modelos
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(141,75,50,0.96),rgba(81,38,26,0.96))] p-6 text-white">
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Flujo de trabajo
            </p>
            <ol className="mt-6 space-y-4">
              {workflowSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-4 border-b border-white/15 pb-4 last:border-b-0 last:pb-0"
                >
                  <span className="font-heading text-4xl leading-none text-accent-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm leading-7 text-white/85">{step}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-4">
        {modules.map((module) => (
          <article
            key={module.title}
            className="rounded-[1.5rem] border border-line bg-surface px-5 py-6 shadow-[0_10px_30px_rgba(64,34,24,0.05)]"
          >
            <p className="font-heading text-3xl text-foreground">{module.title}</p>
            <p className="mt-3 text-sm leading-7 text-foreground/72">{module.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[1.75rem] border border-line bg-white/75 p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
                Prioridad de desarrollo
              </p>
              <h2 className="font-heading text-4xl text-foreground">
                Primer modulo a construir
              </h2>
            </div>
            <span className="rounded-full bg-accent px-4 py-2 text-sm text-white">
              Vestidos + filtros
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.25rem] bg-background p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                Campos base
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-foreground/75">
                <li>Codigo interno, nombre, marca, talla y color.</li>
                <li>Estado del vestido y fecha de ingreso.</li>
                <li>Estado de fotografia y estado de Instagram.</li>
                <li>Notas operativas para el equipo.</li>
              </ul>
            </div>

            <div className="rounded-[1.25rem] bg-background p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/55">
                Acciones clave
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-7 text-foreground/75">
                <li>Filtrar pendientes por talla, marca o nombre.</li>
                <li>Ver modelos compatibles para cada vestido.</li>
                <li>Abrir carpeta editada en un clic.</li>
                <li>Abrir post de Instagram para compartir evidencia.</li>
              </ul>
            </div>
          </div>
        </article>

        <article className="rounded-[1.75rem] border border-line bg-surface-strong p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-foreground/60">
            Base de datos lista
          </p>
          <h2 className="mt-2 font-heading text-4xl text-foreground">
            Entidades modeladas en Prisma
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Dress",
              "ModelProfile",
              "ModelSize",
              "DressAssignment",
              "DressPhoto",
              "DressPhotoFolder",
              "DressInstagramPost",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-foreground/10 bg-white/80 px-4 py-2 text-sm text-foreground/80"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 text-sm leading-7 text-foreground/72">
            El siguiente paso natural es conectar PostgreSQL, correr la primera migracion y
            construir el CRUD de vestidos con filtros y estados de produccion.
          </p>
        </article>
      </section>
    </main>
  );
}

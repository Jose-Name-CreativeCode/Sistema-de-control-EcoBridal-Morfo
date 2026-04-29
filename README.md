# EcoBridal Control

Sistema interno para controlar vestidos, modelos, sesiones de fotografia, carpetas de fotos editadas y publicaciones de Instagram.

## Stack base

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Prisma
- PostgreSQL

## Modulos planeados

- Catalogo de vestidos
- Control de modelos y tallas compatibles
- Asignaciones para fotografia
- Galeria de fotos por vestido
- Link de carpeta editada en Outlook, OneDrive o SharePoint
- Evidencia de publicacion en Instagram

## Esquema inicial

El proyecto ya incluye modelos de Prisma para:

- `Dress`
- `ModelProfile`
- `ModelSize`
- `DressAssignment`
- `DressPhoto`
- `DressPhotoFolder`
- `DressInstagramPost`

## Primeros pasos

1. Copia `.env.example` a `.env`.
2. Configura `DATABASE_URL` con tu instancia de PostgreSQL.
3. Genera el cliente de Prisma:

```bash
npm run db:generate
```

4. Crea la primera migracion:

```bash
npm run db:migrate -- --name init
```

5. Inicia el proyecto:

```bash
npm run dev
```

## Siguiente fase recomendada

- CRUD de vestidos
- Filtros por marca, talla, nombre y estado
- Estado de fotografia
- Campo para link de carpeta editada
- Campo para link del post de Instagram

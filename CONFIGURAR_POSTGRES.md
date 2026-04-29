# Configurar PostgreSQL para EcoBridal Control

## Estado actual

El proyecto ya esta preparado para usar PostgreSQL real, pero en esta maquina no hay:

- `postgres`
- `psql`
- `docker`

Por eso no se puede levantar una base local automaticamente desde aqui.

## Opcion recomendada

Usa una base hospedada en:

- Neon
- Supabase
- Railway

La forma mas simple es Neon o Supabase.

## Paso 1

Crea una base PostgreSQL nueva.

## Paso 2

Copia tu cadena de conexion y pegala en `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"
```

## Paso 3

Genera el cliente de Prisma:

```bash
npm run db:generate
```

## Paso 4

Crea la estructura de tablas:

```bash
npm run db:migrate -- --name init
```

## Paso 5

Carga los vestidos iniciales desde la captura:

```bash
npm run db:seed
```

## Resultado

Eso cargara el catalogo base de vestidos con:

- nombre
- codigo interno
- estado inicial
- bandera de nuevo cuando aplica

Despues ya puedes completar:

- talla
- marca
- color
- notas
- modelos
- links de carpeta
- links de Instagram

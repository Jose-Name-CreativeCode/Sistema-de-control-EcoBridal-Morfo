# Sistema de control EcoBridal Morfo

## 1. Objetivo del sistema

Construir un sistema interno para administrar vestidos de novia usados y su proceso de fotografia, modelaje y publicacion.

El sistema debe permitir:

- Registrar vestidos con su informacion completa.
- Saber cuales vestidos ya fueron fotografiados y cuales faltan.
- Filtrar vestidos por talla, marca, nombre, estado y modelo.
- Relacionar vestidos con modelos adecuadas segun talla.
- Llevar control del avance de produccion de fotos.
- Guardar varias imagenes por vestido.
- Detectar rapidamente los vestidos pendientes por fotografiar.
- Llevar control de si el vestido ya fue publicado en Instagram.

## 2. Modulos principales

### Catalogo de vestidos

Cada vestido debe tener al menos:

- Codigo interno
- Nombre
- Marca
- Talla
- Color
- Estado
- Precio
- Notas
- Fecha de ingreso
- Es nuevo o existente

### Control de fotografia

Por cada vestido:

- Fotografiado: si o no
- Fecha de sesion
- Modelo asignada
- Estado de sesion
- Fotos requeridas
- Fotos completadas
- Link de carpeta de fotos editadas
- Observaciones

Estados sugeridos:

- Pendiente
- Asignado a modelo
- En sesion
- Fotografiado
- Publicado

### Modelos

Cada modelo debe tener:

- Nombre
- Tallas compatibles
- Telefono o contacto
- Costo por hora
- Costo por vestido
- Disponibilidad
- Notas

### Galeria de fotos

Cada vestido puede tener varias imagenes:

- Portada
- Frente completo
- Espalda completa
- Detalle
- Modelo usandolo

Tambien se debe poder guardar un link externo a la carpeta donde estan las fotos editadas, por ejemplo en Outlook, OneDrive o SharePoint.

### Reportes y filtros

Debe permitir:

- Ver cuantos vestidos hay en total
- Ver cuantos faltan por fotografiar
- Filtrar por marca
- Filtrar por talla
- Filtrar por nombre
- Filtrar por estado
- Filtrar por modelo asignada
- Ver solo vestidos nuevos

### Control de publicaciones en Instagram

Cada vestido debe poder registrar:

- Si ya fue publicado o no
- Tipo de publicacion: post, reel, historia o carrusel
- Fecha de publicacion
- Link directo de Instagram
- Usuario o cuenta donde se publico
- Observaciones

Esto sirve para comprobar rapidamente si un vestido ya salio en redes y abrir directamente la publicacion correspondiente.

## 3. Casos de uso clave

1. Registrar un vestido nuevo.
2. Marcar un vestido como pendiente de fotografia.
3. Asignar una modelo compatible por talla.
4. Registrar el costo de la modelo para ese vestido o sesion.
5. Subir fotos del vestido.
6. Marcar el vestido como fotografiado.
7. Filtrar todos los vestidos que faltan por fotografiar.
8. Ver resumen: por ejemplo, 104 vestidos totales, 10 pendientes y 94 completados.
9. Abrir desde el sistema el link de Instagram del vestido para confirmar que si fue publicado.

## 4. Pantallas recomendadas

### Dashboard

- Total de vestidos
- Vestidos fotografiados
- Vestidos pendientes
- Vestidos nuevos
- Proximas sesiones

### Lista de vestidos

- Tabla con filtros
- Busqueda por nombre o codigo
- Vista rapida con miniatura

### Detalle de vestido

- Informacion general
- Estado de fotografia
- Modelo asignada
- Galeria de imagenes
- Link a carpeta externa de fotos editadas
- Estado de publicacion en Instagram
- Boton para abrir publicacion en Instagram
- Historial

### Lista de modelos

- Datos de cada modelo
- Tallas compatibles
- Costos
- Vestidos asignados

### Vista de pendientes

Boton o seccion especial para:

- Mostrar solo vestidos faltantes por fotografiar
- Ver talla de cada vestido
- Sugerir modelos compatibles
- Ver costo estimado de las modelos
- Ver si ya existe carpeta enlazada para las fotos editadas

### Vista de publicaciones

- Ver vestidos ya publicados
- Ver vestidos no publicados
- Filtrar por tipo de publicacion
- Abrir el link directo de Instagram
- Confirmar visualmente que el vestido si fue subido

## 5. Base de datos recomendada

Para este proyecto te recomiendo **PostgreSQL**.

Razones:

- Es robusta y profesional para sistemas internos.
- Maneja bien relaciones entre vestidos, modelos y fotos.
- Escala mejor si el sistema crece.
- Funciona muy bien con stacks modernos.

MySQL tambien serviria, pero para este caso PostgreSQL es mejor opcion.

## 6. Tablas sugeridas

### dresses

- id
- internal_code
- name
- brand
- size
- color
- condition
- price
- is_new
- photo_status
- instagram_status
- notes
- created_at
- updated_at

### models

- id
- name
- contact_phone
- hourly_rate
- per_dress_rate
- notes
- created_at
- updated_at

### model_sizes

- id
- model_id
- size

### dress_model_assignments

- id
- dress_id
- model_id
- assignment_status
- scheduled_date
- cost_agreed
- notes

### dress_photos

- id
- dress_id
- photo_type
- image_url
- sort_order
- created_at

### dress_photo_folders

- id
- dress_id
- assignment_id
- folder_provider
- folder_url
- notes
- created_at

### dress_instagram_posts

- id
- dress_id
- post_type
- instagram_url
- instagram_shortcode
- published_at
- account_name
- caption_notes
- created_at

Tipos de foto sugeridos:

- cover
- front
- back
- detail
- worn_by_model

Tipos de publicacion sugeridos:

- post
- reel
- story
- carousel

Proveedores sugeridos para la carpeta:

- outlook_onedrive
- sharepoint
- otro

## 7. Stack recomendado

Si quieres hacerlo bien y sin complicarte demasiado, te recomiendo este stack:

### Frontend

- HTML
- CSS
- JavaScript
- React
- Next.js
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- Next.js API routes o NestJS

### Base de datos

- PostgreSQL
- Prisma ORM

### Archivos e imagenes

- Cloudinary o Amazon S3

### Autenticacion y seguridad

- Login con correo y contrasena
- Sesiones seguras
- Roles de usuario
- Hash de contrasenas con bcrypt
- Validacion de formularios
- Control de acceso

### Despliegue

- Vercel para frontend y backend sencillo
- Railway, Supabase o Neon para PostgreSQL

## 8. Herramientas que realmente necesitas

### Obligatorias

- HTML
- CSS
- JavaScript
- TypeScript
- React
- Next.js
- PostgreSQL

### Muy recomendables

- Prisma
- Tailwind CSS
- Cloudinary
- Zod
- React Hook Form

### Opcionales

- MySQL
- Docker
- Redis
- NestJS

No necesitas usar PostgreSQL y MySQL al mismo tiempo. Debes elegir una sola base de datos.

## 9. Seguridad basica que debe incluir

- Login protegido
- Contraseñas hasheadas
- Permisos por usuario
- Validacion de datos en frontend y backend
- Proteccion de rutas privadas
- Respaldo de base de datos
- Control de archivos subidos

## 10. Filtros importantes del sistema

- Por nombre del vestido
- Por marca
- Por talla
- Por estado de fotografia
- Por estado de publicacion en Instagram
- Por vestido nuevo o existente
- Por modelo asignada
- Por fecha de ingreso

## 11. Automatizaciones utiles

- Etiqueta automatica "Pendiente de fotografia"
- Contador automatico de vestidos pendientes
- Sugerencia de modelos por talla
- Resumen de costos estimados por sesion
- Validacion de que un vestido tenga al menos una foto portada
- Aviso si falta el link de la carpeta editada al cerrar la sesion
- Aviso si el vestido esta fotografiado pero aun no tiene registro de publicacion

## 12. Orden recomendado para construirlo

### Fase 1

- Crear base del proyecto
- Configurar autenticacion
- Crear base de datos
- Crear CRUD de vestidos

### Fase 2

- Crear CRUD de modelos
- Relacionar modelos con tallas
- Crear asignacion vestido-modelo

### Fase 3

- Subida de imagenes
- Galeria por vestido
- Estados de fotografia
- Campo para link de carpeta editada

### Fase 4

- Control de publicaciones de Instagram
- Boton para abrir link directo de Instagram
- Dashboard
- Filtros avanzados
- Reportes de pendientes

## 13. Version minima viable

Si quieres salir rapido, la primera version solo necesita:

- Login
- Registro de vestidos
- Registro de modelos
- Estado fotografiado o pendiente
- Filtro de vestidos pendientes
- Asignacion de modelo por talla
- Carga de fotos
- Campo para guardar link de carpeta externa
- Campo para guardar link del post de Instagram
- Estado publicado o no publicado

## 14. Recomendacion final

La mejor combinacion para tu caso es:

- Next.js
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- Cloudinary

Eso te da:

- Sistema moderno
- Base solida
- Filtros rapidos
- Carga de imagenes
- Seguridad suficiente
- Facilidad para crecer despues

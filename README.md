# API REST de Fútbol

API construida con **Node.js**, **Express.js** y **MySQL** para gestionar países, estadios, equipos, jugadores, partidos y goles. Incluye CRUD completo de las 6 tablas, validación de datos y manejo de errores, y se conecta a una base de datos MySQL en la nube.

## Estructura del proyecto

```
api-futbol/
├── index.js
├── package.json
├── .env              (local, no se sube a GitHub)
├── .env.example
└── src/
    ├── config/dbConfig.js
    ├── models/        (consultas SQL)
    ├── controllers/   (validación y respuestas)
    └── routes/        (endpoints)
```

## Requisitos

- Node.js (versión LTS)
- Una base de datos MySQL con las tablas creadas (script `futbol_sport_final.sql`)

## Instalación y ejecución

1. Clonar el repositorio e instalar dependencias:
   ```bash
   npm install
   ```
2. Crear el archivo `.env` a partir de `.env.example` y completar los datos de conexión.
3. Iniciar la API:
   ```bash
   npm start
   ```
4. Abrir `http://localhost:3000`. Debe responder `API de fútbol funcionando`.

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (por defecto 3000; en Render lo asigna la plataforma) |
| `DB_HOST` | Host de la base de datos |
| `DB_USER` | Usuario |
| `DB_PASSWORD` | Contraseña |
| `DB_NAME` | Nombre de la base de datos |
| `DB_PORT` | Puerto (3306) |
| `DB_SSL` | `true` si la base de datos exige conexión SSL, `false` en caso contrario |

## Formato de las respuestas

Todas las respuestas son JSON con la propiedad `ok`.

```json
{ "ok": true, "data": { } }
{ "ok": true, "total": 2, "data": [ ] }
{ "ok": true, "mensaje": "Equipo creado correctamente", "data": { } }
{ "ok": false, "error": "Datos inválidos", "detalles": [ "nombre es obligatorio" ] }
```

## Códigos de estado

| Código | Cuándo se devuelve |
|---|---|
| 200 | Lectura, actualización o eliminación correcta |
| 201 | Registro creado |
| 400 | Datos inválidos, id mal formado, o referencia (llave foránea) inexistente |
| 404 | El registro o la ruta no existe |
| 409 | Valor único repetido, o el registro no se puede eliminar porque otros dependen de él |
| 500 | Error interno del servidor |

## Endpoints

| Método | Ruta | Descripción | Códigos |
|---|---|---|---|
| GET | `/api/paises` | Lista de paises (admite filtros por parámetros de consulta) | 200 |
| GET | `/api/paises/:id` | Un registro por id | 200, 400, 404 |
| POST | `/api/paises` | Crea un registro | 201, 400, 409 |
| PUT | `/api/paises/:id` | Actualiza un registro completo | 200, 400, 404, 409 |
| DELETE | `/api/paises/:id` | Elimina un registro | 200, 400, 404, 409 |
| GET | `/api/estadios` | Lista de estadios (admite filtros por parámetros de consulta) | 200 |
| GET | `/api/estadios/:id` | Un registro por id | 200, 400, 404 |
| POST | `/api/estadios` | Crea un registro | 201, 400, 409 |
| PUT | `/api/estadios/:id` | Actualiza un registro completo | 200, 400, 404, 409 |
| DELETE | `/api/estadios/:id` | Elimina un registro | 200, 400, 404, 409 |
| GET | `/api/equipos` | Lista de equipos (admite filtros por parámetros de consulta) | 200 |
| GET | `/api/equipos/:id` | Un registro por id | 200, 400, 404 |
| POST | `/api/equipos` | Crea un registro | 201, 400, 409 |
| PUT | `/api/equipos/:id` | Actualiza un registro completo | 200, 400, 404, 409 |
| DELETE | `/api/equipos/:id` | Elimina un registro | 200, 400, 404, 409 |
| GET | `/api/jugadores` | Lista de jugadores (admite filtros por parámetros de consulta) | 200 |
| GET | `/api/jugadores/:id` | Un registro por id | 200, 400, 404 |
| POST | `/api/jugadores` | Crea un registro | 201, 400, 409 |
| PUT | `/api/jugadores/:id` | Actualiza un registro completo | 200, 400, 404, 409 |
| DELETE | `/api/jugadores/:id` | Elimina un registro | 200, 400, 404, 409 |
| GET | `/api/partidos` | Lista de partidos (admite filtros por parámetros de consulta) | 200 |
| GET | `/api/partidos/:id` | Un registro por id | 200, 400, 404 |
| POST | `/api/partidos` | Crea un registro | 201, 400, 409 |
| PUT | `/api/partidos/:id` | Actualiza un registro completo | 200, 400, 404, 409 |
| DELETE | `/api/partidos/:id` | Elimina un registro | 200, 400, 404, 409 |
| GET | `/api/goles` | Lista de goles (admite filtros por parámetros de consulta) | 200 |
| GET | `/api/goles/:id` | Un registro por id | 200, 400, 404 |
| POST | `/api/goles` | Crea un registro | 201, 400, 409 |
| PUT | `/api/goles/:id` | Actualiza un registro completo | 200, 400, 404, 409 |
| DELETE | `/api/goles/:id` | Elimina un registro | 200, 400, 404, 409 |

## Campos que reciben POST y PUT

| Recurso | Campos |
|---|---|
| `paises` | nombre, codigo_iso |
| `estadios` | nombre, ciudad, capacidad |
| `equipos` | nombre, fundacion, id_pais, id_estadio |
| `jugadores` | documento, nombre, fecha_nac, posicion, dorsal, id_equipo |
| `partidos` | fecha, id_local, id_visitante, id_estadio |
| `goles` | id_partido, id_jugador, minuto, tipo |

Los campos opcionales (`fundacion` e `id_estadio` en equipos, `dorsal` en jugadores) pueden omitirse o enviarse como `null`.

## Filtros (parámetros de consulta)

| Ruta | Parámetros |
|---|---|
| `/api/paises` | `codigo_iso`, `nombre` |
| `/api/estadios` | `ciudad`, `nombre` |
| `/api/equipos` | `id_pais`, `nombre` |
| `/api/jugadores` | `id_equipo`, `posicion`, `nombre` |
| `/api/partidos` | `id_local`, `id_visitante`, `id_estadio`, `fecha` |
| `/api/goles` | `id_partido`, `id_jugador`, `tipo` |

Ejemplo: `GET /api/equipos?id_pais=2` devuelve los equipos de ese país. El parámetro `nombre` busca coincidencias parciales.

## Despliegue en Render

1. Subir el código a GitHub (sin el archivo `.env`).
2. En Render, crear un **Web Service** conectado al repositorio.
3. Build Command: `npm install` · Start Command: `npm start`.
4. En **Environment**, cargar las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` y `DB_SSL`.
5. Probar la URL pública que entrega Render.

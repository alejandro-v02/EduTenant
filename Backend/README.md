# EduTenant — Backend

Backend multi-tenant para gestión escolar. NestJS + TypeORM + PostgreSQL, arquitectura hexagonal por dominio.

## Aislamiento entre instituciones

Ningún endpoint (fuera de `/api/superadministrador/*`) acepta `institucionId` en el body o el query. El valor siempre se extrae del JWT del usuario autenticado mediante el decorator `@InstitucionActual()`, y cada consulta a la base de datos lo usa como filtro obligatorio. Además, `ValidationPipe` está configurado con `forbidNonWhitelisted: true`: si un cliente intenta enviar `institucionId` en un DTO que no lo declara, la petición se rechaza con 400 antes de llegar al controller.

## Puesta en marcha

```bash
# 1. Base de datos
docker compose up -d

# 2. Variables de entorno
cp .env.example .env   # y ajusta valores si hace falta

# 3. Dependencias
npm install

# 4. Arrancar en desarrollo (sincroniza el esquema automáticamente)
npm run start:dev
```

La API queda expuesta bajo el prefijo `/api` (ej. `http://localhost:3000/api/autenticacion/login`).

### Superadministrador inicial

No existe un endpoint público para crear el primer superadministrador (sería un hueco de seguridad). Si `SUPERADMIN_EMAIL` y `SUPERADMIN_CLAVE` están definidos en `.env`, ese usuario se crea automáticamente la primera vez que arranca la aplicación (ver `SembradorSuperadministrador`).

## Roles

| Rol | Alcance |
|---|---|
| `superadministrador` | Global, sin institución. Crea instituciones y su coordinador inicial. |
| `coordinador` | Administra su institución: cursos, profesores, estudiantes, matrículas. |
| `profesor` | Gestiona sus cursos: asistencia, notas, material. |
| `estudiante` | Consulta sus notas, asistencia, matrículas y material. |

## Módulos y endpoints principales

- `autenticacion` — `POST /api/autenticacion/login`
- `superadministrador` — `POST|GET /api/superadministrador/instituciones`
- `instituciones` — `GET|PATCH /api/instituciones/actual`
- `usuarios` — `POST|GET /api/usuarios/profesores`, `POST|GET /api/usuarios/estudiantes`
- `cursos` — `POST|GET /api/cursos`, `GET|PATCH|DELETE /api/cursos/:id`
- `matriculas` — `POST /api/matriculas`, `GET /api/matriculas/curso/:cursoId`, `GET /api/matriculas/mias`
- `asistencia` — `POST /api/asistencia`, `GET /api/asistencia/curso/:cursoId`, `GET /api/asistencia/mia`
- `notas` — `POST /api/notas`, `PATCH /api/notas/:id`, `GET /api/notas/curso/:cursoId`, `GET /api/notas/mias`
- `materiales` — `POST /api/materiales`, `GET /api/materiales/curso/:cursoId`

## Estructura (arquitectura hexagonal por módulo)

```
src/
├── modulos/
│   ├── autenticacion/       (login, JWT, guards)
│   ├── superadministrador/  (crear instituciones + coordinador inicial)
│   ├── instituciones/
│   ├── usuarios/
│   ├── cursos/
│   ├── matriculas/
│   ├── asistencia/
│   ├── notas/
│   └── materiales/
│       ├── dominio/          → entidades y contratos de repositorio, sin TypeORM ni Nest
│       ├── aplicacion/       → casos de uso (servicios)
│       └── infraestructura/  → controllers, DTOs, entidades TypeORM y repositorios concretos
├── compartido/
│   ├── decoradores/    (@UsuarioActual, @Roles, @InstitucionActual)
│   ├── guards/         (JwtAuthGuard, RolesGuard, InstitucionGuard)
│   ├── interceptores/  (InstitucionContextInterceptor)
│   └── tipos/          (RolUsuario, EstadoAsistencia, JwtPayload, UsuarioAutenticado)
└── main.ts
```

## Migraciones

En desarrollo, `synchronize: true` crea el esquema automáticamente. Para producción, usar migraciones:

```bash
npm run migration:generate -- src/migraciones/NombreMigracion
npm run migration:run
```

Y cambiar `synchronize: false` en `src/app.module.ts`.

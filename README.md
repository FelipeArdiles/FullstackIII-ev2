# Innovatech Solutions – EV2 Fullstack III

Plataforma de gestión integral de proyectos tecnológicos (Evaluación Parcial 2 – DSY1106).

## Estructura del repositorio (monorepo)

| Componente | Ruta | Puerto |
|------------|------|--------|
| Microservicio Proyectos | `backend/ms-proyectos` | 8081 |
| Microservicio Recursos | `backend/ms-recursos` | 8082 |
| BFF | `backend/bff` | 8080 |
| App React | `frontend/app/innovatech-web` | 5173 |
| Paquetes NPM | `frontend/packages/*` | — |
| Arquetipos Maven | `archetypes/*` | — |

## Estrategia de branching: Git Flow

Se adoptó **Git Flow** para cumplir el requisito EV2 de **múltiples ramas visibles en GitHub**:

| Rama | Uso |
|------|-----|
| `main` | Código estable / entrega |
| `develop` | Integración de features |
| `feature/*` | Tareas (docs, UI, backend, etc.) |

Flujo: `main` → `develop` → `feature/<tarea>` → merge a `develop` → merge a `main`.

Ramas remotas: [github.com/FelipeArdiles/FullstackIII-ev2/branches](https://github.com/FelipeArdiles/FullstackIII-ev2/branches)

Detalle en [docs/plan-branching.md](docs/plan-branching.md).

## Patrones de diseño

| Capa | Patrones |
|------|----------|
| ms-proyectos | Repository, **Factory Method** (creación de proyectos) |
| ms-recursos | Repository, **Strategy** (cálculo de capacidad) |
| bff | **Facade** (orquestación de microservicios) |
| Frontend NPM | **Observer** (estado reactivo), **Composite** (formularios) |

Documentación: [docs/patrones-arquetipos.md](docs/patrones-arquetipos.md).

## Requisitos

- Java 17+
- Maven 3.9+
- Node.js 18+

## Ejecución con Docker Compose

Requisito: [Docker](https://docs.docker.com/get-docker/) y Docker Compose v2.

```bash
# Desde la raíz del repositorio
docker compose up --build

# Alternativa con script
chmod +x start.sh && ./start.sh
```

| Servicio | URL en el host |
|----------|----------------|
| Frontend (React + nginx) | http://localhost:5173 |
| BFF | http://localhost:8080 |
| ms-proyectos | http://localhost:8081 |
| ms-recursos | http://localhost:8082 |

El frontend sirve la SPA en el puerto **5173** y hace proxy de `/api` al BFF dentro de la red Docker. El BFF se conecta a los microservicios por hostname (`ms-proyectos`, `ms-recursos`). Las bases H2 siguen en memoria dentro de cada MS.

**Troubleshooting breve**

- Puerto ocupado: detener procesos locales en 8080–8082 o 5173, o cambiar el mapeo en `docker-compose.yml`.
- BFF no arranca: esperar healthchecks de los MS (`docker compose ps`).
- Rebuild limpio: `docker compose down -v && docker compose up --build`.
- **Apple Silicon (Mac M1/M2/M3, arm64):** los Dockerfiles usan imágenes con soporte `linux/arm64` y `linux/amd64` (`eclipse-temurin:17-jre`, `maven:3.9-eclipse-temurin-17`, `node:18-alpine`, `nginx:alpine`). Evita variantes `*-alpine` de Temurin en runtime Java; no suelen publicar manifiesto arm64. Si ves `no matching manifest for linux/arm64`, actualiza el repo y reconstruye: `docker compose build --no-cache`.
- **Windows / Linux x86_64 (amd64):** el mismo `docker compose up --build` descarga capas amd64 automáticamente. No hace falta `platform: linux/amd64` salvo que quieras forzar emulación en Mac (más lento).
- Verificar arquitectura de una imagen: `docker image inspect eclipse-temurin:17-jre --format '{{.Architecture}}'`.

## Ejecución rápida (local sin Docker)

### Backend

```bash
# Terminal 1 – Proyectos
cd backend/ms-proyectos && mvn spring-boot:run

# Terminal 2 – Recursos
cd backend/ms-recursos && mvn spring-boot:run

# Terminal 3 – BFF
cd backend/bff && mvn spring-boot:run
```

### Frontend

```bash
cd frontend/app/innovatech-web
npm install
npm run dev
```

### Arquetipo Maven (nuevo microservicio)

```bash
cd archetypes/innovatech-ms-archetype
mvn install
mvn archetype:generate -DarchetypeGroupId=cl.duoc.innovatech \
  -DarchetypeArtifactId=innovatech-ms-archetype \
  -DarchetypeVersion=1.0.0 \
  -DgroupId=cl.duoc.demo -DartifactId=mi-servicio -Dversion=1.0.0-SNAPSHOT
```

## Pruebas

```bash
cd backend/ms-proyectos && mvn test
cd backend/ms-recursos && mvn test
cd backend/bff && mvn test
cd frontend/packages/ui-project-card && npm test
```

## Autor

FelipeArdiles – Fullstack III EV2

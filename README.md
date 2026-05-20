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

## Ejecución rápida

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

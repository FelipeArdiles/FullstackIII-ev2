# Plan de Branching – Git Flow

## Estrategia elegida

**Git Flow** (descartadas GitHub Flow simple y trunk-based para esta entrega EV2).

Se adopta Git Flow porque la evaluación exige **más de una rama visible en GitHub** y un flujo formal de integración (`develop`) separado de producción (`main`).

## Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Código estable en producción / entrega final |
| `develop` | Integración continua de features aprobadas |
| `feature/*` | Desarrollo por tarea (docs, UI, microservicios, etc.) |
| `release/*` | Preparación de versión antes de merge a `main` (opcional en EV2) |
| `hotfix/*` | Correcciones urgentes desde `main` (reservado) |

## Flujo de trabajo

1. Crear `develop` desde `main` (una sola vez).
2. Por cada tarea: `git checkout develop && git checkout -b feature/nombre-tarea`
3. Commits atómicos en la rama `feature/*`
4. Merge `feature/*` → `develop` (local o PR en GitHub)
5. Cuando `develop` está estable: merge `develop` → `main` (o rama `release/x.y.z` → `main` + back-merge a `develop`)

## Ramas en este repositorio (GitHub)

| Rama | Estado | Descripción |
|------|--------|-------------|
| `main` | Activa | Entregable estable EV2 |
| `develop` | Activa | Integración de features |
| `feature/branching-docs` | Mergeada a `develop` | Documentación Git Flow |
| `feature/ui-redesign` | Mergeada a `develop` | Rediseño UI Innovatech Web |

## Evidencia de commits por feature

- `feature/branching-docs`: actualización de este plan y README
- `feature/ui-redesign`: dashboard, dark mode, estados vacíos/carga, toasts

## Gestión de conflictos

- Resolver siempre en la rama `feature` antes del merge a `develop`
- Documentar resolución en el mensaje de merge si hubo conflictos

## Por qué no GitHub Flow solo

GitHub Flow con una sola rama `main` y `feature/*` no cumple el requisito académico de **múltiples ramas persistentes** (`develop`, features visibles en remoto).

## Por qué no trunk-based

Requiere CI/CD continuo y feature flags; el alcance EV2 prioriza patrones de diseño y microservicios con pruebas unitarias básicas.

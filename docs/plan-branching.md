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

### Ejemplo documentado: merge con conflicto en README

Simulación académica (solo documentación; comandos reales usados en EV2):

```bash
# 1. Rama feature desde develop
git checkout develop
git pull origin develop
git checkout -b feature/ev2-rubric-completion

# 2. En develop se añade una línea al README (otro integrante)
git checkout develop
echo "- Nota integración develop" >> README.md
git add README.md && git commit -m "docs: nota en develop"

# 3. En feature se edita la misma zona del README
git checkout feature/ev2-rubric-completion
echo "- Nota feature EV2" >> README.md
git add README.md && git commit -m "docs: nota en feature"

# 4. Merge develop → feature produce conflicto
git merge develop
# Auto-merging README.md
# CONFLICT (content): Merge conflict in README.md

# 5. Resolver manualmente (editar marcadores <<<<<<< ======= >>>>>>>)
git add README.md
git commit -m "merge: resolver conflicto README entre develop y feature"

# 6. Integrar feature en develop
git checkout develop
git merge feature/ev2-rubric-completion
git push origin develop
```

**Resolución típica:** conservar ambas líneas en el README y eliminar los marcadores de conflicto. Nunca hacer merge a `develop` con conflictos sin resolver.

## Por qué no GitHub Flow solo

GitHub Flow con una sola rama `main` y `feature/*` no cumple el requisito académico de **múltiples ramas persistentes** (`develop`, features visibles en remoto).

## Por qué no trunk-based

Requiere CI/CD continuo y feature flags; el alcance EV2 prioriza patrones de diseño y microservicios con pruebas unitarias básicas.

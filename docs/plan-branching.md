# Plan de Branching – GitHub Flow

## Estrategia elegida

**GitHub Flow** (descartadas Git Flow y trunk-based para este alcance académico).

## Ramas

| Rama | Propósito |
|------|-----------|
| `main` | Código estable entregable |
| `feature/*` | Desarrollo por tarea (arquetipos, microservicios, BFF, frontend, docs) |

## Flujo de trabajo

1. Crear rama desde `main`: `git checkout -b feature/nombre-tarea`
2. Commits atómicos por tarea completada
3. Merge a `main` (local o vía PR en GitHub)
4. `main` siempre desplegable

## Evidencia en este repositorio

Commits en `main` con mensajes por tarea:

- Configuración inicial y `.gitignore`
- Arquetipos Maven
- Microservicio proyectos
- Microservicio recursos
- BFF
- Paquetes NPM
- App React
- Documentación y `repositorios.txt`

## Gestión de conflictos

- Resolver en la rama `feature` antes del merge
- Documentar conflictos resueltos en el mensaje de merge si aplica

## Por qué no Git Flow

Git Flow añade ramas `develop`, `release` y `hotfix` innecesarias para un equipo académico con entregas por evaluación parcial.

## Por qué no trunk-based

Requiere disciplina de CI/CD continua que excede el alcance actual de la EV2 (pruebas unitarias básicas, sin pipeline completo aún).

# Tarjetas de estudio – Defensa EV2 Innovatech

Respuestas cortas (≈3 líneas). Proyecto: **FelipeArdiles/FullstackIII-ev2**.

---

## 1. ¿Qué patrón usaste en el BFF y por qué?

**Facade** (`InnovatechFacade` en `backend/bff`).

El frontend necesita proyectos, miembros y detalle agregado sin llamar a dos microservicios. El BFF expone `/api/bff/*` y orquesta ms-proyectos y ms-recursos en un solo lugar.

---

## 2. ¿Factory Method o Abstract Factory? ¿Cuál tienes?

**Factory Method** (`ProjectFactory` + `PlannedProjectCreator` / `InProgressProjectCreator`).

Un solo tipo de producto (proyecto) con distinta forma de creación según estado inicial. Abstract Factory sería varias familias de objetos relacionados; aquí no aplica.

---

## 3. Nombra 3 patrones backend con archivo concreto.

1. **Repository** – `ProjectRepository`, `TeamMemberRepository` (JPA).  
2. **Strategy** – `StandardCapacityStrategy`, `SeniorCapacityStrategy` (capacidad por rol).  
3. **Adapter** – `ProjectClientAdapter` (ms-recursos valida proyectos vía REST).

*(Alternativa: **Facade** en BFF.)*

---

## 4. ¿Qué patrones tienes en el frontend NPM?

**Observer** – `ProjectSelectionSubject` en `@innovatech/ui-project-card`: al seleccionar proyecto, la UI reacciona.

**Composite** – `CompositeForm` + `FormField` en `@innovatech/ui-capacity-form`: validación unificada de formularios.

**Bonus:** `@innovatech/ui-button` reutilizable en toda la app.

---

## 5. ¿Por qué Git Flow y no solo GitHub Flow?

La EV2 exige **varias ramas visibles** (`main`, `develop`, `feature/*`).

Git Flow separa integración (`develop`) de producción (`main`). GitHub Flow solo con `main` + features es más simple pero muestra menos estructura de integración.

---

## 6. Git Flow vs GitHub Flow vs Trunk-Based (una frase cada uno).

| Estrategia | En una frase |
|------------|----------------|
| **Git Flow** | `main` + `develop` + feature/release/hotfix; ideal releases y equipos grandes. |
| **GitHub Flow** | `main` + feature + PR; ideal CD y equipos medianos. |
| **Trunk-Based** | Commits frecuentes a `main`; requiere CI fuerte y feature flags. |

**Yo elegí Git Flow** por ramas de integración y evidencia académica en GitHub.

---

## 7. ¿Qué es un monorepo y cómo gestionas componentes?

**Un solo repositorio** con carpetas: `backend/*`, `frontend/packages/*`, `frontend/app/*`, `archetypes/*`.

Cada componente tiene ruta y puerto en `repositorios.txt`. Los NPM se enlazan con `file:../../packages/...` sin publicar a npmjs por separado.

---

## 8. ¿Cómo resuelves un merge conflict?

Siempre **en la rama `feature`**, antes de merge a `develop`.

Edito archivos (quito `<<<<<<<`, `=======`, `>>>>>>>`), `git add`, commit de merge. Ejemplo documentado en `docs/plan-branching.md` con conflicto en README.

---

## 9. ¿Cómo evitas datos inconsistentes en el frontend?

**Observer** para selección de proyecto (una notificación, varios componentes actualizados).

Datos del negocio vienen del **BFF** (`bffClient.js`). Tableros y asignaciones usan estado en hooks + `localStorage` como fuente local coherente.

---

## 10. ¿Por qué BFF si ya tienes microservicios?

Para **no acoplar** React a dos APIs, puertos y contratos distintos.

El BFF **agrega** respuestas (ej. detalle = proyecto + miembros + capacidad media). Facade del material 2.1.1: interfaz simple para el cliente.

---

## Bonus A – Error real: `No default constructor` en Adapter

`ProjectClientAdapter` tenía dos constructores; Spring no sabía cuál usar.

Solución: `@Autowired` en el constructor con `@Value` para producción; otro constructor solo para tests.

---

## Bonus B – ¿Cómo levantas todo el proyecto?

```bash
docker compose up --build
```

Frontend: http://localhost:5173 | BFF: 8080 | ms-proyectos: 8081 | ms-recursos: 8082.  
Nginx hace proxy `/api` → BFF (evita CORS).

---

## Bonus C – Demo en 30 segundos

1. Abrir **Proyectos** → clic en un proyecto → ver info, equipos, **asignar tarea a usuario**.  
2. Ir a **Tableros** → abrir un tablero → mover tarjeta / cambiar asignado.  
3. Mencionar **GitHub** → ramas `main`, `develop`, `feature/*`.

---

## Checklist antes de entrar

- [ ] Docker Desktop encendido  
- [ ] `docker compose up --build` probado  
- [ ] Saber ubicar `InnovatechFacade`, `ProjectFactory`, `ProjectClientAdapter`  
- [ ] Saber explicar Git Flow en 4 pasos  
- [ ] PDF entrega: `docs/patrones-arquetipos.pdf` y `docs/plan-branching.pdf`

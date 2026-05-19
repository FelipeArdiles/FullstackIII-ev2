# Microservicio de Gestión de Proyectos

API REST para administrar proyectos tecnológicos de Innovatech Solutions.

## Patrones

- **Repository**: `ProjectRepository` (JPA)
- **Factory Method**: `ProjectFactory` + `PlannedProjectCreator` / `InProgressProjectCreator`

## Ejecución

```bash
mvn spring-boot:run
```

Puerto: **8081**

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/projects` | Registrar proyecto |
| GET | `/api/projects` | Listar proyectos |
| GET | `/api/projects/{id}` | Detalle |
| PUT | `/api/projects/{id}` | Actualizar |
| PATCH | `/api/projects/{id}/status` | Cambiar estado |

## Pruebas

```bash
mvn test
```

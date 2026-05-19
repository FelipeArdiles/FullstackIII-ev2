# Microservicio de Gestión de Recursos Humanos

Administra miembros del equipo, asignación a proyectos y **capacidad (capacity)**.

## Patrones

- **Repository**: `TeamMemberRepository`
- **Strategy**: `StandardCapacityStrategy` / `SeniorCapacityStrategy`
- **Adapter**: `ProjectClientAdapter` (integración con ms-proyectos)

## Ejecución

```bash
mvn spring-boot:run
```

Puerto: **8082** (requiere ms-proyectos en 8081 para asignaciones).

## Pruebas

```bash
mvn test
```

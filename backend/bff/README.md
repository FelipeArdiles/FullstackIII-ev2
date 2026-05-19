# Backend For Frontend (BFF)

Capa de orquestación entre el frontend React y los microservicios.

## Patrón Facade

`InnovatechFacade` centraliza llamadas a ms-proyectos y ms-recursos.

## Ejecución

```bash
# Requiere microservicios activos
mvn spring-boot:run
```

Puerto: **8080**

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/bff/projects` | Lista proyectos |
| GET | `/api/bff/members` | Lista miembros |
| GET | `/api/bff/projects/{id}/detail` | Proyecto + equipo + capacidad |
| POST | `/api/bff/projects` | Crear proyecto |
| POST | `/api/bff/members` | Crear miembro |

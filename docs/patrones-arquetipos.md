# Análisis de Patrones y Arquetipos – Innovatech Solutions EV2

## Contexto

Innovatech Solutions requiere una plataforma de gestión de proyectos con microservicios, BFF y frontend modular.

## Patrones de diseño implementados

| Patrón | Componente | Problema que resuelve |
|--------|------------|------------------------|
| **Repository** | ms-proyectos, ms-recursos | Desacopla lógica de negocio de JPA/Hibernate |
| **Factory Method** | `ProjectFactory`, `PlannedProjectCreator`, `InProgressProjectCreator` | Creación de proyectos según estado inicial sin acoplar el servicio a constructores concretos |
| **Strategy** | `StandardCapacityStrategy`, `SeniorCapacityStrategy` | Cálculo de capacidad variable según rol del recurso |
| **Adapter** | `ProjectClientAdapter` | Integración REST con ms-proyectos sin exponer detalles HTTP al dominio de recursos |
| **Facade** | `InnovatechFacade` (BFF) | Interfaz única y simplificada para el frontend sobre múltiples microservicios |
| **Observer** | `ProjectSelectionSubject` (NPM) | Notificación reactiva al seleccionar un proyecto en la UI |
| **Composite** | `CompositeForm`, `FormField` (NPM) | Validación uniforme de formularios compuestos |

## Arquetipos y arquitectura

| Arquetipo / patrón arquitectónico | Uso |
|-----------------------------------|-----|
| **Microservicios** | ms-proyectos, ms-recursos (dominios separados, BD H2 independiente) |
| **BFF** | Agregación orientada al frontend, sin lógica de negocio compleja |
| **API REST** | Comunicación JSON entre capas |
| **Arquetipos Maven** | `innovatech-ms-archetype`, `innovatech-bff-archetype` para estandarizar nuevos servicios |
| **Monorepo** | Un repositorio con componentes versionados por carpeta (enlaces en `repositorios.txt`) |

## Justificación

- **Factory Method**: el caso exige creación de proyectos con estados distintos (PLANNED, IN_PROGRESS).
- **Facade en BFF**: el alcance pide combinar proyectos, tareas y equipos; aquí se combinan proyecto + miembros + KPI de capacidad.
- **Strategy**: la EV2 Parcial 2 enfatiza visualizar **capacity** de recursos; roles senior pueden tener reglas distintas.
- **Observer / Composite en NPM**: cumplen el requisito de componentes frontend reutilizables con patrones explícitos.

## Supuestos

- Microservicio de **tareas** se deja para EV3; EV2 implementa **proyectos + recursos (capacity)** según instrucciones del Parcial 2 del caso semestral.
- BD H2 en memoria para desarrollo y demostración académica.

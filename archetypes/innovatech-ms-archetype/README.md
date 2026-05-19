# Arquetipo Maven – Microservicio Innovatech

Arquetipo base para generar microservicios Spring Boot con JPA y H2.

## Instalación local

```bash
mvn install
```

## Generar un nuevo proyecto

```bash
mvn archetype:generate \
  -DarchetypeGroupId=cl.duoc.innovatech \
  -DarchetypeArtifactId=innovatech-ms-archetype \
  -DarchetypeVersion=1.0.0 \
  -DgroupId=cl.duoc.miservicio \
  -DartifactId=ms-ejemplo \
  -Dversion=1.0.0-SNAPSHOT \
  -Dpackage=cl.duoc.miservicio
```

## Estructura generada

- `Application.java` – punto de entrada Spring Boot
- `application.yml` – configuración H2 y puerto
- `pom.xml` – dependencias web, JPA, validación y tests

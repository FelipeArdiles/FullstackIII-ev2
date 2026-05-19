package cl.duoc.innovatech.proyectos.repository;

import cl.duoc.innovatech.proyectos.model.Project;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/** Patrón Repository: abstrae el acceso a persistencia JPA. */
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);
}

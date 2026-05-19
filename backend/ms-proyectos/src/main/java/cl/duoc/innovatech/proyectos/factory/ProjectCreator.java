package cl.duoc.innovatech.proyectos.factory;

import cl.duoc.innovatech.proyectos.dto.ProjectRequest;
import cl.duoc.innovatech.proyectos.model.Project;

/** Factory Method: interfaz para creadores de proyectos. */
public interface ProjectCreator {
    Project create(ProjectRequest request);
}

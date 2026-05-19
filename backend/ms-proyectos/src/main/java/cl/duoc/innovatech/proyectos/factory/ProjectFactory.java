package cl.duoc.innovatech.proyectos.factory;

import cl.duoc.innovatech.proyectos.dto.ProjectRequest;
import cl.duoc.innovatech.proyectos.model.Project;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import org.springframework.stereotype.Component;

/**
 * Factory Method: delega la creación según el estado inicial solicitado.
 */
@Component
public class ProjectFactory {

    private final PlannedProjectCreator plannedCreator;
    private final InProgressProjectCreator inProgressCreator;

    public ProjectFactory(PlannedProjectCreator plannedCreator,
                          InProgressProjectCreator inProgressCreator) {
        this.plannedCreator = plannedCreator;
        this.inProgressCreator = inProgressCreator;
    }

    public Project create(ProjectRequest request) {
        ProjectStatus initial = request.initialStatus() != null
                ? request.initialStatus()
                : ProjectStatus.PLANNED;
        return switch (initial) {
            case IN_PROGRESS -> inProgressCreator.create(request);
            default -> plannedCreator.create(request);
        };
    }
}

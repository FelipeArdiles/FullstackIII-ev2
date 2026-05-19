package cl.duoc.innovatech.proyectos.factory;

import cl.duoc.innovatech.proyectos.dto.ProjectRequest;
import cl.duoc.innovatech.proyectos.model.Project;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import org.springframework.stereotype.Component;

@Component
public class PlannedProjectCreator implements ProjectCreator {
    @Override
    public Project create(ProjectRequest request) {
        Project project = new Project();
        project.setName(request.name());
        project.setDescription(request.description());
        project.setStatus(ProjectStatus.PLANNED);
        project.setTeamId(request.teamId());
        return project;
    }
}

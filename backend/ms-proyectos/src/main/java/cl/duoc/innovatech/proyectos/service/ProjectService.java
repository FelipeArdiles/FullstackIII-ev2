package cl.duoc.innovatech.proyectos.service;

import cl.duoc.innovatech.proyectos.dto.ProjectRequest;
import cl.duoc.innovatech.proyectos.dto.ProjectResponse;
import cl.duoc.innovatech.proyectos.factory.ProjectFactory;
import cl.duoc.innovatech.proyectos.model.Project;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import cl.duoc.innovatech.proyectos.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository repository;
    private final ProjectFactory projectFactory;

    public ProjectService(ProjectRepository repository, ProjectFactory projectFactory) {
        this.repository = repository;
        this.projectFactory = projectFactory;
    }

    public ProjectResponse create(ProjectRequest request) {
        Project project = projectFactory.create(request);
        return ProjectResponse.from(repository.save(project));
    }

    public List<ProjectResponse> findAll() {
        return repository.findAll().stream().map(ProjectResponse::from).toList();
    }

    public ProjectResponse findById(Long id) {
        return repository.findById(id)
                .map(ProjectResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado"));
    }

    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado"));
        project.setName(request.name());
        project.setDescription(request.description());
        if (request.teamId() != null) {
            project.setTeamId(request.teamId());
        }
        return ProjectResponse.from(repository.save(project));
    }

    public ProjectResponse updateStatus(Long id, ProjectStatus status) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado"));
        if (status == ProjectStatus.COMPLETED && project.getPendingTasks() > 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "No se puede finalizar un proyecto con tareas pendientes");
        }
        project.setStatus(status);
        return ProjectResponse.from(repository.save(project));
    }

    public void updatePendingTasks(Long id, int pendingTasks) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto no encontrado"));
        project.setPendingTasks(pendingTasks);
        repository.save(project);
    }

    public boolean exists(Long id) {
        return repository.existsById(id);
    }
}

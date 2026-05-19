package cl.duoc.innovatech.proyectos.service;

import cl.duoc.innovatech.proyectos.factory.InProgressProjectCreator;
import cl.duoc.innovatech.proyectos.factory.PlannedProjectCreator;
import cl.duoc.innovatech.proyectos.factory.ProjectFactory;
import cl.duoc.innovatech.proyectos.model.Project;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import cl.duoc.innovatech.proyectos.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock private ProjectRepository repository;
    private ProjectService service;

    @BeforeEach
    void setUp() {
        ProjectFactory factory = new ProjectFactory(new PlannedProjectCreator(), new InProgressProjectCreator());
        service = new ProjectService(repository, factory);
    }

    @Test
    void noPermiteCompletarConTareasPendientes() {
        Project project = new Project();
        project.setId(1L);
        project.setName("X");
        project.setDescription("Y");
        project.setStatus(ProjectStatus.IN_PROGRESS);
        project.setPendingTasks(3);
        when(repository.findById(1L)).thenReturn(Optional.of(project));

        assertThrows(ResponseStatusException.class,
                () -> service.updateStatus(1L, ProjectStatus.COMPLETED));
    }
}

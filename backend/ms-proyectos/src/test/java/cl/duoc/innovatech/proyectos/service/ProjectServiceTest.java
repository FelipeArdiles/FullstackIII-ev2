package cl.duoc.innovatech.proyectos.service;

import cl.duoc.innovatech.proyectos.dto.ProjectRequest;
import cl.duoc.innovatech.proyectos.dto.ProjectResponse;
import cl.duoc.innovatech.proyectos.factory.InProgressProjectCreator;
import cl.duoc.innovatech.proyectos.factory.PlannedProjectCreator;
import cl.duoc.innovatech.proyectos.factory.ProjectFactory;
import cl.duoc.innovatech.proyectos.model.Project;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import cl.duoc.innovatech.proyectos.repository.ProjectRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
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
    void creaProyectoYLoPersiste() {
        when(repository.save(any(Project.class))).thenAnswer(inv -> {
            Project p = inv.getArgument(0);
            p.setId(10L);
            return p;
        });

        ProjectResponse response = service.create(
                new ProjectRequest("Portal", "Desc", ProjectStatus.PLANNED, null));

        assertEquals("Portal", response.name());
        assertEquals(ProjectStatus.PLANNED, response.status());
        verify(repository).save(any(Project.class));
    }

    @Test
    void findByIdLanza404SiNoExiste() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> service.findById(99L));
    }

    @Test
    void findAllMapeaEntidades() {
        Project project = new Project();
        project.setId(1L);
        project.setName("A");
        project.setDescription("B");
        project.setStatus(ProjectStatus.IN_PROGRESS);
        when(repository.findAll()).thenReturn(List.of(project));

        List<ProjectResponse> all = service.findAll();

        assertEquals(1, all.size());
        assertEquals("A", all.get(0).name());
    }

    @Test
    void updateModificaNombreYDescripcion() {
        Project project = new Project();
        project.setId(1L);
        project.setName("Viejo");
        project.setDescription("Antigua");
        project.setStatus(ProjectStatus.PLANNED);
        when(repository.findById(1L)).thenReturn(Optional.of(project));
        when(repository.save(project)).thenReturn(project);

        ProjectResponse updated = service.update(1L,
                new ProjectRequest("Nuevo", "Actualizada", null, 5L));

        assertEquals("Nuevo", updated.name());
        assertEquals("Actualizada", updated.description());
        assertEquals(5L, project.getTeamId());
    }

    @Test
    void updateStatusCompletaProyectoSinTareasPendientes() {
        Project project = new Project();
        project.setId(1L);
        project.setName("X");
        project.setDescription("Y");
        project.setStatus(ProjectStatus.IN_PROGRESS);
        project.setPendingTasks(0);
        when(repository.findById(1L)).thenReturn(Optional.of(project));
        when(repository.save(project)).thenReturn(project);

        ProjectResponse response = service.updateStatus(1L, ProjectStatus.COMPLETED);

        assertEquals(ProjectStatus.COMPLETED, response.status());
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

    @Test
    void updatePendingTasksActualizaContador() {
        Project project = new Project();
        project.setId(2L);
        project.setPendingTasks(1);
        when(repository.findById(2L)).thenReturn(Optional.of(project));

        service.updatePendingTasks(2L, 4);

        ArgumentCaptor<Project> captor = ArgumentCaptor.forClass(Project.class);
        verify(repository).save(captor.capture());
        assertEquals(4, captor.getValue().getPendingTasks());
    }

    @Test
    void existsDelegaEnRepositorio() {
        when(repository.existsById(7L)).thenReturn(true);

        assertTrue(service.exists(7L));
    }
}

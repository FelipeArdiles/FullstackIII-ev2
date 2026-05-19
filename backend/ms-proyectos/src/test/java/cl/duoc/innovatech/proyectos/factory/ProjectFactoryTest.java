package cl.duoc.innovatech.proyectos.factory;

import cl.duoc.innovatech.proyectos.dto.ProjectRequest;
import cl.duoc.innovatech.proyectos.model.Project;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ProjectFactoryTest {

    private ProjectFactory factory;

    @BeforeEach
    void setUp() {
        factory = new ProjectFactory(new PlannedProjectCreator(), new InProgressProjectCreator());
    }

    @Test
    void creaProyectoPlanificadoPorDefecto() {
        ProjectRequest req = new ProjectRequest("Portal", "Descripción", null, null);
        Project p = factory.create(req);
        assertEquals(ProjectStatus.PLANNED, p.getStatus());
        assertEquals("Portal", p.getName());
    }

    @Test
    void creaProyectoEnProgreso() {
        ProjectRequest req = new ProjectRequest("API", "REST", ProjectStatus.IN_PROGRESS, 1L);
        Project p = factory.create(req);
        assertEquals(ProjectStatus.IN_PROGRESS, p.getStatus());
    }
}

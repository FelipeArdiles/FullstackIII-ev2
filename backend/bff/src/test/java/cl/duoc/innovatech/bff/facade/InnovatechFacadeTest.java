package cl.duoc.innovatech.bff.facade;

import cl.duoc.innovatech.bff.dto.ProjectDetailDto;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class InnovatechFacadeTest {

    private MockWebServer proyectosServer;
    private MockWebServer recursosServer;
    private InnovatechFacade facade;

    @BeforeEach
    void setUp() throws IOException {
        proyectosServer = new MockWebServer();
        recursosServer = new MockWebServer();
        proyectosServer.start();
        recursosServer.start();

        WebClient proyectos = WebClient.builder()
                .baseUrl(proyectosServer.url("/").toString())
                .build();
        WebClient recursos = WebClient.builder()
                .baseUrl(recursosServer.url("/").toString())
                .build();
        facade = new InnovatechFacade(proyectos, recursos);
    }

    @AfterEach
    void tearDown() throws IOException {
        proyectosServer.shutdown();
        recursosServer.shutdown();
    }

    @Test
    void listProjectsRetornaListaDelMicroservicio() {
        proyectosServer.enqueue(new MockResponse()
                .setBody("[{\"id\":1,\"name\":\"Portal\",\"status\":\"PLANNED\"}]")
                .addHeader("Content-Type", "application/json"));

        List<Map<String, Object>> projects = facade.listProjects();

        assertEquals(1, projects.size());
        assertEquals("Portal", projects.get(0).get("name"));
    }

    @Test
    void listMembersRetornaListaVaciaSiNoHayDatos() {
        recursosServer.enqueue(new MockResponse()
                .setBody("[]")
                .addHeader("Content-Type", "application/json"));

        List<Map<String, Object>> members = facade.listMembers();

        assertTrue(members.isEmpty());
    }

    @Test
    void getProjectDetailAgregaMiembrosYCapacidadPromedio() {
        proyectosServer.enqueue(new MockResponse()
                .setBody("{\"id\":1,\"name\":\"API\",\"description\":\"REST\"}")
                .addHeader("Content-Type", "application/json"));
        recursosServer.enqueue(new MockResponse()
                .setBody("[{\"name\":\"Ana\",\"availableCapacityPercent\":80},{\"name\":\"Luis\",\"availableCapacityPercent\":40}]")
                .addHeader("Content-Type", "application/json"));

        ProjectDetailDto detail = facade.getProjectDetail(1L);

        assertEquals("API", detail.project().get("name"));
        assertEquals(2, detail.members().size());
        assertEquals(60.0, detail.averageCapacityPercent(), 0.01);
    }

    @Test
    void createProjectEnviaPostAlMicroservicio() throws InterruptedException {
        proyectosServer.enqueue(new MockResponse()
                .setBody("{\"id\":2,\"name\":\"Nuevo\"}")
                .addHeader("Content-Type", "application/json"));

        Map<String, Object> created = facade.createProject(Map.of(
                "name", "Nuevo",
                "description", "Desc",
                "initialStatus", "PLANNED"
        ));

        assertEquals("Nuevo", created.get("name"));
        assertEquals("/api/projects", proyectosServer.takeRequest().getPath());
    }
}

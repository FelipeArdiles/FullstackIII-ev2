package cl.duoc.innovatech.recursos.adapter;

import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;

class ProjectClientAdapterTest {

    private MockWebServer server;
    private ProjectClientAdapter adapter;

    @BeforeEach
    void setUp() throws IOException {
        server = new MockWebServer();
        server.start();
        RestClient restClient = RestClient.builder().baseUrl(server.url("/").toString()).build();
        adapter = new ProjectClientAdapter(restClient);
    }

    @AfterEach
    void tearDown() throws IOException {
        server.shutdown();
    }

    @Test
    void projectExistsRetornaTrueCuandoElServicioRespondeExists() throws InterruptedException {
        server.enqueue(new MockResponse()
                .setBody("{\"exists\":true}")
                .addHeader("Content-Type", "application/json"));

        assertTrue(adapter.projectExists(1L));
        assertEquals("/api/projects/1/exists", server.takeRequest().getPath());
    }

    @Test
    void projectExistsRetornaFalseSiElServicioFalla() {
        server.enqueue(new MockResponse().setResponseCode(404));

        assertFalse(adapter.projectExists(99L));
    }

    @Test
    void projectExistsRetornaFalseSiExistsEsFalse() {
        server.enqueue(new MockResponse()
                .setBody("{\"exists\":false}")
                .addHeader("Content-Type", "application/json"));

        assertFalse(adapter.projectExists(5L));
    }
}

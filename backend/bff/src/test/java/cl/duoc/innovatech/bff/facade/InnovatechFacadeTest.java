package cl.duoc.innovatech.bff.facade;

import org.junit.jupiter.api.Test;
import org.springframework.web.reactive.function.client.WebClient;
import static org.junit.jupiter.api.Assertions.*;

class InnovatechFacadeTest {

    @Test
    void facadeSeInstanciaCorrectamente() {
        WebClient proyectos = WebClient.builder().baseUrl("http://localhost:8081").build();
        WebClient recursos = WebClient.builder().baseUrl("http://localhost:8082").build();
        InnovatechFacade facade = new InnovatechFacade(proyectos, recursos);
        assertNotNull(facade);
    }
}

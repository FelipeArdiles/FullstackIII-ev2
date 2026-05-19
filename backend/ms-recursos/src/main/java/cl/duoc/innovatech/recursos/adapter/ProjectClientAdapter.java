package cl.duoc.innovatech.recursos.adapter;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

/**
 * Adapter: encapsula la comunicación REST con el microservicio de proyectos.
 */
@Component
public class ProjectClientAdapter {

    private final RestClient restClient;

    public ProjectClientAdapter(@Value("${services.proyectos.url}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public boolean projectExists(Long projectId) {
        try {
            var response = restClient.get()
                    .uri("/api/projects/{id}/exists", projectId)
                    .retrieve()
                    .body(java.util.Map.class);
            return response != null && Boolean.TRUE.equals(response.get("exists"));
        } catch (Exception e) {
            return false;
        }
    }
}

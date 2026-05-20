package cl.duoc.innovatech.bff.facade;

import cl.duoc.innovatech.bff.dto.ProjectDetailDto;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.*;

/**
 * Facade: simplifica el acceso del frontend a proyectos y recursos.
 */
@Component
public class InnovatechFacade {

    private final WebClient proyectosClient;
    private final WebClient recursosClient;

    public InnovatechFacade(WebClient proyectosClient, WebClient recursosClient) {
        this.proyectosClient = proyectosClient;
        this.recursosClient = recursosClient;
    }

    public List<Map<String, Object>> listProjects() {
        return proyectosClient.get()
                .uri("/api/projects")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .blockOptional()
                .orElse(List.of());
    }

    public List<Map<String, Object>> listMembers() {
        return recursosClient.get()
                .uri("/api/members")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .blockOptional()
                .orElse(List.of());
    }

    public ProjectDetailDto getProjectDetail(Long projectId) {
        Map<String, Object> project = proyectosClient.get()
                .uri("/api/projects/{id}", projectId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        List<Map<String, Object>> members = recursosClient.get()
                .uri("/api/members/by-project/{id}", projectId)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                .blockOptional()
                .orElse(List.of());

        double avgCapacity = members.stream()
                .mapToDouble(m -> ((Number) m.getOrDefault("availableCapacityPercent", 0)).doubleValue())
                .average()
                .orElse(0);

        return new ProjectDetailDto(project, members, avgCapacity);
    }

    public Map<String, Object> createProject(Map<String, Object> body) {
        return proyectosClient.post()
                .uri("/api/projects")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> createMember(Map<String, Object> body) {
        return recursosClient.post()
                .uri("/api/members")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    public Map<String, Object> updateProject(Long id, Map<String, Object> body) {
        return proyectosClient.put()
                .uri("/api/projects/{id}", id)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();
    }

    /** Stub EV2: tareas completas en EV3. */
    public List<Map<String, Object>> listTasksStub() {
        return List.of(
                Map.of("id", 1, "title", "Definir arquitectura BFF", "status", "DONE", "projectId", 1),
                Map.of("id", 2, "title", "Integrar capacity dashboard", "status", "IN_PROGRESS", "projectId", 1),
                Map.of("id", 3, "title", "Microservicio de tareas (EV3)", "status", "PENDING", "projectId", null)
        );
    }
}

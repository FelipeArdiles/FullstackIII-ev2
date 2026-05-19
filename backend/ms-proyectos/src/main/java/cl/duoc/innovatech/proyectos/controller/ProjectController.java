package cl.duoc.innovatech.proyectos.controller;

import cl.duoc.innovatech.proyectos.dto.ProjectRequest;
import cl.duoc.innovatech.proyectos.dto.ProjectResponse;
import cl.duoc.innovatech.proyectos.model.ProjectStatus;
import cl.duoc.innovatech.proyectos.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<ProjectResponse> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ProjectResponse get(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/{id}/exists")
    public Map<String, Boolean> exists(@PathVariable Long id) {
        return Map.of("exists", service.exists(id));
    }

    @PutMapping("/{id}")
    public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public ProjectResponse updateStatus(@PathVariable Long id, @RequestBody Map<String, ProjectStatus> body) {
        return service.updateStatus(id, body.get("status"));
    }

    @PatchMapping("/{id}/pending-tasks")
    public void pendingTasks(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        service.updatePendingTasks(id, body.getOrDefault("count", 0));
    }
}

package cl.duoc.innovatech.bff.controller;

import cl.duoc.innovatech.bff.dto.ProjectDetailDto;
import cl.duoc.innovatech.bff.facade.InnovatechFacade;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bff")
@CrossOrigin(origins = "*")
public class BffController {

    private final InnovatechFacade facade;

    public BffController(InnovatechFacade facade) {
        this.facade = facade;
    }

    @GetMapping("/projects")
    public List<Map<String, Object>> projects() {
        return facade.listProjects();
    }

    @GetMapping("/members")
    public List<Map<String, Object>> members() {
        return facade.listMembers();
    }

    @GetMapping("/projects/{id}/detail")
    public ProjectDetailDto projectDetail(@PathVariable Long id) {
        return facade.getProjectDetail(id);
    }

    @PostMapping("/projects")
    public Map<String, Object> createProject(@RequestBody Map<String, Object> body) {
        return facade.createProject(body);
    }

    @PostMapping("/members")
    public Map<String, Object> createMember(@RequestBody Map<String, Object> body) {
        return facade.createMember(body);
    }

    @PutMapping("/projects/{id}")
    public Map<String, Object> updateProject(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return facade.updateProject(id, body);
    }

    @GetMapping("/tasks")
    public List<Map<String, Object>> tasksStub() {
        return facade.listTasksStub();
    }
}

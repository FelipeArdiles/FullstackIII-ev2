package cl.duoc.innovatech.recursos.controller;

import cl.duoc.innovatech.recursos.dto.MemberRequest;
import cl.duoc.innovatech.recursos.dto.MemberResponse;
import cl.duoc.innovatech.recursos.service.MemberService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {

    private final MemberService service;

    public MemberController(MemberService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse create(@Valid @RequestBody MemberRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<MemberResponse> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public MemberResponse get(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/by-project/{projectId}")
    public List<MemberResponse> byProject(@PathVariable Long projectId) {
        return service.findByProject(projectId);
    }

    @PostMapping("/{id}/assign")
    public MemberResponse assign(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Long projectId = Long.valueOf(body.get("projectId").toString());
        int hours = Integer.parseInt(body.getOrDefault("hours", 8).toString());
        return service.assignToProject(id, projectId, hours);
    }
}

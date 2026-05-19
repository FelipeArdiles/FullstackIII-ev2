package cl.duoc.innovatech.recursos.service;

import cl.duoc.innovatech.recursos.adapter.ProjectClientAdapter;
import cl.duoc.innovatech.recursos.dto.MemberRequest;
import cl.duoc.innovatech.recursos.dto.MemberResponse;
import cl.duoc.innovatech.recursos.model.TeamMember;
import cl.duoc.innovatech.recursos.repository.TeamMemberRepository;
import cl.duoc.innovatech.recursos.strategy.CapacityStrategy;
import cl.duoc.innovatech.recursos.strategy.SeniorCapacityStrategy;
import cl.duoc.innovatech.recursos.strategy.StandardCapacityStrategy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class MemberService {

    private final TeamMemberRepository repository;
    private final ProjectClientAdapter projectAdapter;
    private final StandardCapacityStrategy standardStrategy;
    private final SeniorCapacityStrategy seniorStrategy;

    public MemberService(TeamMemberRepository repository,
                         ProjectClientAdapter projectAdapter,
                         StandardCapacityStrategy standardStrategy,
                         SeniorCapacityStrategy seniorStrategy) {
        this.repository = repository;
        this.projectAdapter = projectAdapter;
        this.standardStrategy = standardStrategy;
        this.seniorStrategy = seniorStrategy;
    }

    private CapacityStrategy strategyFor(String role) {
        if (role != null && role.toLowerCase().contains("senior")) {
            return seniorStrategy;
        }
        return standardStrategy;
    }

    public MemberResponse create(MemberRequest request) {
        repository.findByEmail(request.email()).ifPresent(m -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Miembro duplicado");
        });
        TeamMember member = new TeamMember();
        member.setName(request.name());
        member.setRole(request.role());
        member.setEmail(request.email());
        if (request.weeklyHours() != null) {
            member.setWeeklyHours(request.weeklyHours());
        }
        return toResponse(repository.save(member));
    }

    public List<MemberResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public MemberResponse findById(Long id) {
        return repository.findById(id).map(this::toResponse)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Miembro no encontrado"));
    }

    public List<MemberResponse> findByProject(Long projectId) {
        return repository.findByProjectIdsContaining(projectId).stream()
                .map(this::toResponse).toList();
    }

    public MemberResponse assignToProject(Long memberId, Long projectId, int hours) {
        if (!projectAdapter.projectExists(projectId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Proyecto no existe");
        }
        TeamMember member = repository.findById(memberId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Miembro no encontrado"));
        member.getProjectIds().add(projectId);
        member.setAssignedHours(member.getAssignedHours() + hours);
        return toResponse(repository.save(member));
    }

    private MemberResponse toResponse(TeamMember member) {
        double capacity = strategyFor(member.getRole())
                .availablePercentage(member.getWeeklyHours(), member.getAssignedHours());
        return MemberResponse.from(member, capacity);
    }
}

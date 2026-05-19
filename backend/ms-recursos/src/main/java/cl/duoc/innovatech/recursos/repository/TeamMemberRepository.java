package cl.duoc.innovatech.recursos.repository;

import cl.duoc.innovatech.recursos.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {
    Optional<TeamMember> findByEmail(String email);
    List<TeamMember> findByProjectIdsContaining(Long projectId);
}

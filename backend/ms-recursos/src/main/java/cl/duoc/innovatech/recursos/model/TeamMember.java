package cl.duoc.innovatech.recursos.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "team_members", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private int weeklyHours = 40;

    @Column(nullable = false)
    private int assignedHours = 0;

    @ElementCollection
    @CollectionTable(name = "member_projects", joinColumns = @JoinColumn(name = "member_id"))
    @Column(name = "project_id")
    private Set<Long> projectIds = new HashSet<>();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getWeeklyHours() { return weeklyHours; }
    public void setWeeklyHours(int weeklyHours) { this.weeklyHours = weeklyHours; }
    public int getAssignedHours() { return assignedHours; }
    public void setAssignedHours(int assignedHours) { this.assignedHours = assignedHours; }
    public Set<Long> getProjectIds() { return projectIds; }
    public void setProjectIds(Set<Long> projectIds) { this.projectIds = projectIds; }
}

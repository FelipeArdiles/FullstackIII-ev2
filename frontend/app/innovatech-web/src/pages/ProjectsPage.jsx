import { capacityBadge } from '@innovatech/ui-capacity-form';
import { Button } from '@innovatech/ui-button';
import ProjectWorkspacePanel from '../components/ProjectWorkspacePanel';
import { getLeadName } from '../data/mockCatalog';

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PLANNED', label: 'Planificados' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'COMPLETED', label: 'Completados' }
];

export default function ProjectsPage({
  catalogProjects,
  members,
  filteredProjects,
  statusFilter,
  onStatusFilter,
  projectForm,
  onProjectFormChange,
  memberForm,
  onMemberFormChange,
  onCreateProject,
  onCreateMember,
  selectedId,
  selectionSubject,
  selectedCatalogProject,
  apiDetail,
  workspace,
  editForm,
  onEditChange,
  onSaveProject,
  saving,
  membersByProject,
  toast
}) {
  return (
    <section className="page-section">
      <div className="page-head">
        <h2>Proyectos</h2>
        <p className="page-subtitle">
          {catalogProjects.length} proyectos en catálogo · 30 colaboradores ficticios · clic en un proyecto para ver ficha completa, equipos y asignación de tareas.
        </p>
      </div>

      <div className="projects-layout">
        <aside className="projects-sidebar panel">
          <div className="panel-head">
            <h2>Listado</h2>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              aria-label="Filtrar por estado"
            >
              {STATUS_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <form onSubmit={onCreateProject} className="inline-form compact-form">
            <input placeholder="Nombre proyecto *" value={projectForm.name}
              onChange={(e) => onProjectFormChange({ ...projectForm, name: e.target.value })} />
            <textarea placeholder="Descripción *" rows={2} value={projectForm.description}
              onChange={(e) => onProjectFormChange({ ...projectForm, description: e.target.value })} />
            <Button type="submit" variant="primary" label="Crear (BFF)" />
          </form>
          <div className="project-list-scroll">
            {filteredProjects.length === 0 ? (
              <p className="empty-state">No hay proyectos con este filtro.</p>
            ) : (
              filteredProjects.map((p) => (
                <article
                  key={p.id}
                  className={`project-card project-card--list ${selectedId === p.id ? 'selected' : ''}`}
                  onClick={() => selectionSubject.select(p.id)}
                  onKeyDown={(e) => e.key === 'Enter' && selectionSubject.select(p.id)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="project-code">{p.code || `PRJ-${p.id}`}</span>
                  <strong>{p.name}</strong>
                  <span className="project-card-meta">{p.client || '—'} · {getLeadName(p)}</span>
                  <span className={`badge badge--${(p.status || 'planned').toLowerCase()}`}>{p.status}</span>
                </article>
              ))
            )}
          </div>
        </aside>

        <div className="projects-main">
          {selectedCatalogProject ? (
            <ProjectWorkspacePanel
              project={selectedCatalogProject}
              apiDetail={apiDetail}
              teams={workspace.getTeamsForProject(selectedCatalogProject.id)}
              projectTasks={workspace.getTasksForProject(selectedCatalogProject.id)}
              workspace={workspace}
              editForm={editForm}
              onEditChange={onEditChange}
              onSaveProject={onSaveProject}
              saving={saving}
              toast={toast}
            />
          ) : (
            <div className="empty-state panel select-hint">
              <p>Selecciona un proyecto del listado para ver información general, equipos de trabajo y asignar tareas a usuarios.</p>
            </div>
          )}
        </div>
      </div>

      <details className="panel resources-collapse">
        <summary>Recursos y capacidad (BFF) — {members.length} en API</summary>
        <form onSubmit={onCreateMember} className="inline-form">
          <input placeholder="Nombre *" value={memberForm.name}
            onChange={(e) => onMemberFormChange({ ...memberForm, name: e.target.value })} />
          <input placeholder="Rol *" value={memberForm.role}
            onChange={(e) => onMemberFormChange({ ...memberForm, role: e.target.value })} />
          <input placeholder="Email *" type="email" value={memberForm.email}
            onChange={(e) => onMemberFormChange({ ...memberForm, email: e.target.value })} />
          <Button type="submit" variant="secondary" label="Registrar miembro" />
        </form>
        <div className="members-compact-grid">
          {(selectedId ? membersByProject : members).slice(0, 12).map((m) => {
            const cap = capacityBadge(m.availableCapacityPercent ?? 0);
            return (
              <div key={m.id} className="member-row member-row--compact">
                <strong>{m.name}</strong>
                <span className="member-role">{m.role}</span>
                <small className={`capacity-label capacity-label--${cap.level}`}>{cap.label}</small>
              </div>
            );
          })}
        </div>
      </details>
    </section>
  );
}

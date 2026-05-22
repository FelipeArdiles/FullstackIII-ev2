import { useMemo } from 'react';
import { Button } from '@innovatech/ui-button';
import { capacityBadge } from '@innovatech/ui-capacity-form';
import {
  MOCK_MEMBERS,
  getLeadName,
  getMemberById
} from '../data/mockCatalog';
import { PRIORITIES } from '../data/mockData';

const TASK_STATUSES = [
  { id: 'BACKLOG', label: 'Backlog' },
  { id: 'TODO', label: 'Por hacer' },
  { id: 'IN_PROGRESS', label: 'En progreso' },
  { id: 'REVIEW', label: 'Revisión' },
  { id: 'DONE', label: 'Hecho' }
];

export default function ProjectWorkspacePanel({
  project,
  apiDetail,
  teams,
  projectTasks,
  workspace,
  editForm,
  onEditChange,
  onSaveProject,
  saving,
  toast
}) {
  const leadName = getLeadName(project);
  const mergedDescription = project.description || apiDetail?.project?.description || '';

  const tasksByAssignee = useMemo(() => {
    const map = {};
    projectTasks.forEach((t) => {
      const key = t.assigneeId ?? 'unassigned';
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [projectTasks]);

  if (!project) return null;

  return (
    <section className="panel project-workspace">
      <div className="panel-head">
        <div>
          <span className="project-code">{project.code || `PRJ-${project.id}`}</span>
          <h2>{project.name}</h2>
        </div>
        <span className={`badge badge--${(project.status || 'planned').toLowerCase()}`}>
          {project.status}
        </span>
      </div>

      {/* Información general */}
      <div className="workspace-section">
        <h3>Información general</h3>
        <div className="info-grid">
          <div><dt>Cliente</dt><dd>{project.client || '—'}</dd></div>
          <div><dt>Líder técnico</dt><dd>{leadName}</dd></div>
          <div><dt>Presupuesto</dt><dd>{project.budget || '—'}</dd></div>
          <div><dt>Inicio</dt><dd>{project.startDate || '—'}</dd></div>
          <div><dt>Fin estimado</dt><dd>{project.endDate || '—'}</dd></div>
          <div><dt>Capacidad equipo (API)</dt><dd>{Number(apiDetail?.averageCapacityPercent ?? 0).toFixed(1)}%</dd></div>
        </div>
        <p className="detail-description">{mergedDescription}</p>
        {project.objectives?.length > 0 && (
          <>
            <h4>Objetivos</h4>
            <ul className="objectives-list">
              {project.objectives.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </>
        )}
        <div className="tag-row">
          {(project.tags || []).map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Equipos de trabajo */}
      <div className="workspace-section">
        <h3>Equipos de trabajo ({teams.length})</h3>
        <p className="section-hint">Asigna colaboradores a cada equipo del proyecto.</p>
        {teams.length === 0 ? (
          <p className="empty-state">Este proyecto aún no tiene equipos definidos en el catálogo.</p>
        ) : (
          <div className="teams-grid">
            {teams.map((team) => (
              <article key={team.id} className="team-box panel">
                <h4>{team.name}</h4>
                <p className="team-count">{team.memberIds.length} integrantes</p>
                <ul className="team-member-list">
                  {team.memberIds.map((mid) => {
                    const m = getMemberById(mid);
                    if (!m) return null;
                    return (
                      <li key={mid}>
                        <span className="avatar">{m.avatar}</span>
                        <span>{m.name}</span>
                        <span className="member-role">{m.role}</span>
                        <button
                          type="button"
                          className="link-btn link-btn--danger"
                          onClick={() => {
                            workspace.removeMemberFromTeam(team.id, mid);
                            toast?.(`${m.name} removido del equipo`, 'info');
                          }}
                        >
                          Quitar
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <label className="add-to-team">
                  Agregar al equipo
                  <select
                    defaultValue=""
                    onChange={(e) => {
                      const mid = Number(e.target.value);
                      if (!mid) return;
                      workspace.addMemberToTeam(team.id, mid);
                      toast?.('Integrante agregado al equipo', 'success');
                      e.target.value = '';
                    }}
                  >
                    <option value="">Seleccionar usuario…</option>
                    {MOCK_MEMBERS.filter((m) => !team.memberIds.includes(m.id)).map((m) => (
                      <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
                    ))}
                  </select>
                </label>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Tareas del proyecto */}
      <div className="workspace-section">
        <h3>Tareas definidas en el proyecto ({projectTasks.length})</h3>
        <p className="section-hint">
          Historias de usuario del backlog. Asigna responsable y equipo; el estado se actualiza aquí.
        </p>
        <div className="project-tasks-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Tarea</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Asignar a usuario</th>
                <th>Equipo</th>
              </tr>
            </thead>
            <tbody>
              {projectTasks.map((task) => {
                const pr = PRIORITIES.find((p) => p.id === task.priority);
                const assignee = getMemberById(task.assigneeId);
                return (
                  <tr key={task.id}>
                    <td><code>{task.code}</code></td>
                    <td><strong>{task.title}</strong></td>
                    <td>
                      <select
                        value={task.status}
                        onChange={(e) => workspace.updateTaskStatus(task.id, e.target.value)}
                      >
                        {TASK_STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td><span style={{ color: pr?.color }}>{pr?.label}</span></td>
                    <td>
                      <select
                        value={task.assigneeId ?? ''}
                        onChange={(e) => {
                          const id = e.target.value ? Number(e.target.value) : null;
                          workspace.assignTaskToUser(task.id, id);
                          toast?.('Tarea asignada al usuario', 'success');
                        }}
                      >
                        <option value="">Sin asignar</option>
                        {MOCK_MEMBERS.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                      {assignee && (
                        <span className="assignee-chip">
                          <span className="avatar">{assignee.avatar}</span> {assignee.name}
                        </span>
                      )}
                    </td>
                    <td>
                      <select
                        value={task.teamId ?? ''}
                        onChange={(e) => {
                          workspace.assignTaskToTeam(task.id, e.target.value || null);
                          toast?.('Tarea vinculada al equipo', 'success');
                        }}
                      >
                        <option value="">Sin equipo</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumen por usuario */}
      <div className="workspace-section">
        <h3>Carga por usuario en este proyecto</h3>
        <div className="assignee-summary-grid">
          {Object.entries(tasksByAssignee).map(([key, tasks]) => {
            const m = key === 'unassigned' ? null : getMemberById(Number(key));
            const label = m ? m.name : 'Sin asignar';
            return (
              <article key={key} className="assignee-summary-card">
                <div className="assignee-summary-head">
                  {m && <span className="avatar">{m.avatar}</span>}
                  <strong>{label}</strong>
                  <span className="task-count-badge">{tasks.length} tarea(s)</span>
                </div>
                <ul>
                  {tasks.map((t) => (
                    <li key={t.id}>
                      <code>{t.code}</code> {t.title}
                      <span className={`badge badge--${String(t.status).toLowerCase()}`}>{t.status}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>

      {/* Miembros API */}
      {apiDetail?.members?.length > 0 && (
        <div className="workspace-section">
          <h3>Recursos vinculados (BFF)</h3>
          <ul className="member-detail-list">
            {apiDetail.members.map((m) => {
              const cap = capacityBadge(m.availableCapacityPercent ?? 0);
              return (
                <li key={m.id ?? m.email} className="member-detail-item">
                  <strong>{m.name}</strong>
                  <span className="member-role">{m.role}</span>
                  <span className={`capacity-label capacity-label--${cap.level}`}>{cap.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {onSaveProject && (
        <form className="inline-form edit-form" onSubmit={onSaveProject}>
          <h3>Editar proyecto (API)</h3>
          <input placeholder="Nombre" value={editForm.name} onChange={(e) => onEditChange({ ...editForm, name: e.target.value })} />
          <textarea placeholder="Descripción" rows={2} value={editForm.description} onChange={(e) => onEditChange({ ...editForm, description: e.target.value })} />
          <Button type="submit" variant="primary" label={saving ? 'Guardando…' : 'Guardar en BFF'} disabled={saving} />
        </form>
      )}
    </section>
  );
}

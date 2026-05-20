import { capacityBadge } from '@innovatech/ui-capacity-form';
import { Button } from '@innovatech/ui-button';

export default function ProjectDetailPanel({ detail, editForm, onEditChange, onSave, saving }) {
  if (!detail) return null;

  const project = detail.project || {};
  const members = detail.members || [];

  return (
    <section className="panel detail-panel">
      <div className="panel-head">
        <h2>Detalle del proyecto</h2>
        <span className={`badge badge--${(project.status || 'planned').toLowerCase()}`}>{project.status}</span>
      </div>
      <p className="detail-description">{project.description}</p>
      <p>
        Capacidad promedio del equipo:{' '}
        <strong>{Number(detail.averageCapacityPercent ?? 0).toFixed(1)}%</strong>
      </p>

      <h3>Miembros asignados ({members.length})</h3>
      {members.length === 0 ? (
        <p className="empty-state">Sin miembros vinculados a este proyecto.</p>
      ) : (
        <ul className="member-detail-list">
          {members.map((m) => {
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
      )}

      <form className="inline-form edit-form" onSubmit={onSave}>
        <h3>Editar proyecto</h3>
        <input
          placeholder="Nombre"
          value={editForm.name}
          onChange={(e) => onEditChange({ ...editForm, name: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          rows={2}
          value={editForm.description}
          onChange={(e) => onEditChange({ ...editForm, description: e.target.value })}
        />
        <Button type="submit" variant="primary" label={saving ? 'Guardando…' : 'Guardar cambios'} disabled={saving} />
      </form>
    </section>
  );
}

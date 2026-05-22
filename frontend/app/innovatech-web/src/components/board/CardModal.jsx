import { useState, useEffect } from 'react';
import { Button } from '@innovatech/ui-button';
import { LABELS, PRIORITIES, MOCK_MEMBERS } from '../../data/mockData';

export default function CardModal({ task, onClose, onSave, onArchive, onDuplicate }) {
  const [form, setForm] = useState(task);

  useEffect(() => {
    setForm(task);
  }, [task]);

  if (!task || !form) return null;

  const toggleLabel = (labelId) => {
    const labels = form.labels.includes(labelId)
      ? form.labels.filter((l) => l !== labelId)
      : [...form.labels, labelId];
    setForm({ ...form, labels });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Editar tarjeta</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">×</button>
        </header>
        <form onSubmit={handleSubmit} className="modal-body">
          <label>
            Título
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <label>
            Descripción
            <textarea rows={4} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="modal-row">
            <label>
              Prioridad
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </label>
            <label>
              Asignado
              <select
                value={form.assigneeId ?? ''}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value ? Number(e.target.value) : null })}
              >
                <option value="">Sin asignar</option>
                {MOCK_MEMBERS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="modal-row">
            <label>
              Fecha límite
              <input type="date" value={form.dueDate || ''}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </label>
            <label>
              Story points
              <input type="number" min={1} max={21} value={form.storyPoints}
                onChange={(e) => setForm({ ...form, storyPoints: Number(e.target.value) })} />
            </label>
          </div>
          <fieldset className="label-picker">
            <legend>Etiquetas</legend>
            <div className="label-chips">
              {LABELS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className={`label-chip ${form.labels.includes(l.id) ? 'label-chip--on' : ''}`}
                  style={{ '--chip-color': l.color }}
                  onClick={() => toggleLabel(l.id)}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </fieldset>
          <footer className="modal-footer">
            <Button type="button" variant="secondary" label="Duplicar" onClick={() => { onDuplicate(task.id); onClose(); }} />
            <Button type="button" variant="secondary" label="Archivar" onClick={() => { onArchive(task.id); onClose(); }} />
            <Button type="submit" variant="primary" label="Guardar" />
          </footer>
        </form>
      </div>
    </div>
  );
}

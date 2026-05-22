import { Button } from '@innovatech/ui-button';
import {
  SORT_OPTIONS,
  GROUP_OPTIONS,
  BOARD_TEMPLATES,
  COLUMN_DEFS,
  PRIORITIES,
  MOCK_MEMBERS,
  LABELS
} from '../../data/mockData';

export default function BoardToolbar({
  board,
  settings,
  filters,
  onFilterChange,
  onSettingsChange,
  onApplyTemplate,
  onAddTask,
  onBack,
  onExport,
  viewMode,
  onViewModeChange
}) {
  return (
    <div className="board-toolbar panel">
      <div className="board-toolbar-top">
        <div>
          <button type="button" className="link-btn" onClick={onBack}>← Tableros</button>
          <h2>{board.name}</h2>
          <p className="board-meta">{board.projectName} · {board.type}</p>
        </div>
        <div className="toolbar-actions">
          <Button variant="primary" label="+ Nueva tarjeta" onClick={onAddTask} />
          <Button variant="secondary" label="Exportar" onClick={onExport} />
        </div>
      </div>

      <div className="toolbar-grid">
        <label>
          Plantilla
          <select
            value={settings.template}
            onChange={(e) => onApplyTemplate(e.target.value)}
          >
            {BOARD_TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>

        <label>
          Ordenar
          <select value={filters.sort} onChange={(e) => onFilterChange({ sort: e.target.value })}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </label>

        <label>
          Agrupar
          <select value={filters.group} onChange={(e) => onFilterChange({ group: e.target.value })}>
            {GROUP_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </label>

        <label>
          Swimlanes
          <select
            value={settings.swimlanes}
            onChange={(e) => onSettingsChange({ swimlanes: e.target.value })}
          >
            <option value="none">Desactivadas</option>
            <option value="priority">Por prioridad</option>
            <option value="assignee">Por asignado</option>
          </select>
        </label>

        <label>
          Vista
          <select value={viewMode} onChange={(e) => onViewModeChange(e.target.value)}>
            <option value="board">Tablero</option>
            <option value="list">Lista</option>
          </select>
        </label>

        <label>
          Densidad
          <select
            value={settings.cardDensity}
            onChange={(e) => onSettingsChange({ cardDensity: e.target.value })}
          >
            <option value="compact">Compacta</option>
            <option value="normal">Normal</option>
          </select>
        </label>

        <label>
          Buscar en tablero
          <input
            type="search"
            placeholder="Título o descripción…"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
          />
        </label>

        <label>
          Prioridad
          <select value={filters.priority} onChange={(e) => onFilterChange({ priority: e.target.value })}>
            <option value="ALL">Todas</option>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </label>

        <label>
          Asignado
          <select value={filters.assignee} onChange={(e) => onFilterChange({ assignee: e.target.value })}>
            <option value="ALL">Todos</option>
            <option value="ME">Mis tareas (Camila)</option>
            {MOCK_MEMBERS.map((m) => (
              <option key={m.id} value={String(m.id)}>{m.name}</option>
            ))}
          </select>
        </label>

        <label>
          Etiqueta
          <select value={filters.label} onChange={(e) => onFilterChange({ label: e.target.value })}>
            <option value="ALL">Todas</option>
            {LABELS.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="toolbar-quick">
        <span className="toolbar-label">Filtros rápidos:</span>
        <button type="button" className="chip-btn" onClick={() => onFilterChange({ quick: 'high' })}>
          Alta prioridad
        </button>
        <button type="button" className="chip-btn" onClick={() => onFilterChange({ quick: 'week' })}>
          Vence esta semana
        </button>
        <button type="button" className="chip-btn" onClick={() => onFilterChange({ quick: 'unassigned' })}>
          Sin asignar
        </button>
        <button type="button" className="chip-btn" onClick={() => onFilterChange({ quick: 'clear' })}>
          Limpiar filtros
        </button>
        <label className="wip-toggle">
          <input
            type="checkbox"
            checked={settings.showWip}
            onChange={(e) => onSettingsChange({ showWip: e.target.checked })}
          />
          Mostrar límites WIP
        </label>
      </div>

      <details className="column-toggles">
        <summary>Columnas visibles</summary>
        <div className="column-toggle-grid">
          {COLUMN_DEFS.map((col) => (
            <label key={col.id}>
              <input
                type="checkbox"
                checked={settings.visibleColumns.includes(col.id)}
                onChange={(e) => {
                  const visible = e.target.checked
                    ? [...settings.visibleColumns, col.id]
                    : settings.visibleColumns.filter((c) => c !== col.id);
                  if (visible.length > 0) onSettingsChange({ visibleColumns: visible });
                }}
              />
              {col.title}
              {col.wipLimit != null && ` (WIP ${col.wipLimit})`}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}

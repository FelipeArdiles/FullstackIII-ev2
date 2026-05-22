import { useMemo } from 'react';
import { LABELS, PRIORITIES, MOCK_MEMBERS } from '../../data/mockData';
import { filterAndSortTasks, groupTasks } from '../../utils/boardFilters';

function getMember(id) {
  return MOCK_MEMBERS.find((m) => m.id === id);
}

function getPriority(id) {
  return PRIORITIES.find((p) => p.id === id);
}

function KanbanCard({ task, density, columnDefs, onEdit, onMove }) {
  const assignee = getMember(task.assigneeId);
  const priority = getPriority(task.priority);
  return (
    <article
      className={`kanban-card kanban-card--${density}`}
      onClick={() => onEdit(task)}
      onKeyDown={(e) => e.key === 'Enter' && onEdit(task)}
      role="button"
      tabIndex={0}
    >
      <div className="kanban-card-top">
        <span className="priority-dot" style={{ background: priority?.color }} title={priority?.label} />
        {task.storyPoints != null && <span className="sp-badge">{task.storyPoints} SP</span>}
      </div>
      <h4>{task.title}</h4>
      {density !== 'compact' && task.description && (
        <p className="kanban-card-desc">{task.description.slice(0, 80)}{task.description.length > 80 ? '…' : ''}</p>
      )}
      <div className="kanban-labels">
        {(task.labels || []).map((lid) => {
          const l = LABELS.find((x) => x.id === lid);
          return l ? (
            <span key={lid} className="mini-label" style={{ background: l.color }}>{l.name}</span>
          ) : null;
        })}
      </div>
      <div className="kanban-card-foot">
        {assignee ? (
          <span className="avatar" title={assignee.name}>{assignee.avatar}</span>
        ) : (
          <span className="avatar avatar--empty">?</span>
        )}
        {task.dueDate && <time dateTime={task.dueDate}>{task.dueDate}</time>}
      </div>
      <select
        className="move-select"
        value={task.columnId}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => onMove(task.id, e.target.value)}
        aria-label="Mover tarjeta"
      >
        {columnDefs.map((c) => (
          <option key={c.id} value={c.id}>→ {c.title}</option>
        ))}
      </select>
    </article>
  );
}

export default function KanbanBoard({
  tasks,
  columnDefs,
  visibleColumns,
  settings,
  filters,
  onEdit,
  onMove
}) {
  const filtered = useMemo(
    () => filterAndSortTasks(tasks, filters, MOCK_MEMBERS),
    [tasks, filters]
  );

  const columns = columnDefs.filter((c) => visibleColumns.includes(c.id));

  const swimlaneGroups = useMemo(() => {
    if (settings.swimlanes === 'none') {
      return [{ key: 'default', label: null }];
    }
    if (settings.swimlanes === 'priority') {
      return PRIORITIES.map((p) => ({ key: p.id, label: p.label }));
    }
    return MOCK_MEMBERS.map((m) => ({ key: String(m.id), label: m.name }));
  }, [settings.swimlanes]);

  const taskInSwimlane = (task, lane) => {
    if (settings.swimlanes === 'priority') return task.priority === lane.key;
    if (settings.swimlanes === 'assignee') return String(task.assigneeId) === lane.key;
    return true;
  };

  const groupedByColumn = (colId, laneTasks) =>
    laneTasks.filter((t) => t.columnId === colId);

  return (
    <div className="kanban-board">
      {swimlaneGroups.map((lane) => {
        const laneTasks =
          settings.swimlanes === 'none'
            ? filtered
            : filtered.filter((t) => taskInSwimlane(t, lane));

        if (settings.swimlanes !== 'none' && laneTasks.length === 0) return null;

        const columnGroups = groupTasks(laneTasks, filters.group, MOCK_MEMBERS, LABELS);

        return (
          <div key={lane.key} className="swimlane">
            {lane.label && <h3 className="swimlane-title">{lane.label}</h3>}
            <div className="kanban-columns">
              {columns.map((col) => {
                const colTasks = groupedByColumn(col.id, laneTasks);
                const overWip = col.wipLimit != null && colTasks.length > col.wipLimit;
                return (
                  <div
                    key={`${lane.key}-${col.id}`}
                    className={`kanban-column ${overWip && settings.showWip ? 'kanban-column--over' : ''}`}
                  >
                    <header className="kanban-column-head">
                      <span>{col.title}</span>
                      <span className="col-count">{colTasks.length}</span>
                      {settings.showWip && col.wipLimit != null && (
                        <span className="wip-limit">WIP {col.wipLimit}</span>
                      )}
                    </header>
                    <div className="kanban-column-body">
                      {filters.group !== 'none' ? (
                        columnGroups.map((g) => {
                          const inCol = g.tasks.filter((t) => t.columnId === col.id);
                          if (!inCol.length) return null;
                          return (
                            <div key={g.key} className="card-group">
                              {g.label && <span className="group-label">{g.label}</span>}
                              {inCol.map((task) => (
                                <KanbanCard
                                  key={task.id}
                                  task={task}
                                  density={settings.cardDensity}
                                  columnDefs={columnDefs}
                                  onEdit={onEdit}
                                  onMove={onMove}
                                />
                              ))}
                            </div>
                          );
                        })
                      ) : (
                        colTasks.map((task) => (
                          <KanbanCard
                            key={task.id}
                            task={task}
                            density={settings.cardDensity}
                            columnDefs={columnDefs}
                            onEdit={onEdit}
                            onMove={onMove}
                          />
                        ))
                      )}
                      {colTasks.length === 0 && (
                        <p className="col-empty">Arrastra o crea una tarjeta</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

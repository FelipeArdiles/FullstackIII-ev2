import { useState, useMemo } from 'react';
import BoardToolbar from '../components/board/BoardToolbar';
import KanbanBoard from '../components/board/KanbanBoard';
import CardModal from '../components/board/CardModal';
import { filterAndSortTasks } from '../utils/boardFilters';
import { MOCK_MEMBERS, PRIORITIES } from '../data/mockData';

const DEFAULT_FILTERS = {
  sort: 'priority',
  group: 'none',
  search: '',
  priority: 'ALL',
  assignee: 'ALL',
  label: 'ALL',
  quick: ''
};

export default function BoardPage({
  board,
  boardState,
  toast
}) {
  const {
    getBoardSettings,
    updateBoardSettings,
    getTasksForBoard,
    moveTask,
    updateTask,
    addTask,
    archiveTask,
    duplicateTask,
    applyTemplate,
    columnDefs
  } = boardState;

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState('board');
  const [editingTask, setEditingTask] = useState(null);

  const settings = getBoardSettings(board.id);
  const tasks = getTasksForBoard(board.id);

  const handleFilterChange = (patch) => {
    if (patch.quick === 'clear') {
      setFilters(DEFAULT_FILTERS);
      return;
    }
    setFilters((f) => ({ ...f, ...patch, quick: patch.quick ?? (patch.quick === undefined ? f.quick : '') }));
  };

  const filtered = useMemo(
    () => filterAndSortTasks(tasks, filters, MOCK_MEMBERS),
    [tasks, filters]
  );

  const handleAddTask = () => {
    const col = settings.visibleColumns.includes('todo') ? 'todo' : settings.visibleColumns[0];
    const task = addTask(board.id, col, { title: 'Nueva historia de usuario' });
    setEditingTask(task);
    toast('Tarjeta creada', 'success');
  };

  if (viewMode === 'list') {
    return (
      <section className="page-section board-page">
        <BoardToolbar
          board={board}
          settings={settings}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSettingsChange={(p) => updateBoardSettings(board.id, p)}
          onApplyTemplate={(t) => applyTemplate(board.id, t)}
          onAddTask={handleAddTask}
          onBack={boardState.onBack}
          onExport={() => toast('Vista exportada (simulado)', 'info')}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="list-view panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Columna</th>
                <th>Prioridad</th>
                <th>Asignado</th>
                <th>Vence</th>
                <th>SP</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const col = columnDefs.find((c) => c.id === t.columnId);
                const pr = PRIORITIES.find((p) => p.id === t.priority);
                const mem = MOCK_MEMBERS.find((m) => m.id === t.assigneeId);
                return (
                  <tr key={t.id}>
                    <td><button type="button" className="link-btn" onClick={() => setEditingTask(t)}>{t.title}</button></td>
                    <td>{col?.title}</td>
                    <td><span style={{ color: pr?.color }}>{pr?.label}</span></td>
                    <td>{mem?.name || '—'}</td>
                    <td>{t.dueDate || '—'}</td>
                    <td>{t.storyPoints}</td>
                    <td>
                      <select value={t.columnId} onChange={(e) => moveTask(t.id, e.target.value)}>
                        {columnDefs.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <CardModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(form) => updateTask(form.id, form)}
          onArchive={archiveTask}
          onDuplicate={duplicateTask}
        />
      </section>
    );
  }

  return (
    <section className="page-section board-page">
      <BoardToolbar
        board={board}
        settings={settings}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSettingsChange={(p) => updateBoardSettings(board.id, p)}
        onApplyTemplate={(t) => applyTemplate(board.id, t)}
        onAddTask={handleAddTask}
        onBack={boardState.onBack}
        onExport={() => toast('Exportación CSV preparada (simulado)', 'info')}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <KanbanBoard
        tasks={tasks}
        columnDefs={columnDefs}
        visibleColumns={settings.visibleColumns}
        settings={settings}
        filters={filters}
        onEdit={setEditingTask}
        onMove={moveTask}
      />
      <CardModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={(form) => updateTask(form.id, form)}
        onArchive={archiveTask}
        onDuplicate={duplicateTask}
      />
    </section>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MOCK_BOARDS,
  MOCK_TASKS,
  COLUMN_DEFS,
  BOARD_TEMPLATES
} from '../data/mockData';

const STORAGE_KEY = 'innovatech-board-state-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        boards: parsed.boards ?? MOCK_BOARDS,
        tasks: parsed.tasks ?? MOCK_TASKS,
        boardSettings: parsed.boardSettings ?? {}
      };
    }
  } catch {
    /* ignore */
  }
  return { boards: MOCK_BOARDS, tasks: MOCK_TASKS, boardSettings: {} };
}

const defaultSettings = (boardId) => ({
  visibleColumns: COLUMN_DEFS.map((c) => c.id),
  template: 'KANBAN',
  swimlanes: 'none',
  cardDensity: 'normal',
  showWip: true
});

export function useBoardState() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getBoardSettings = useCallback(
    (boardId) => ({
      ...defaultSettings(boardId),
      ...(state.boardSettings[boardId] || {})
    }),
    [state.boardSettings]
  );

  const updateBoardSettings = useCallback((boardId, patch) => {
    setState((prev) => ({
      ...prev,
      boardSettings: {
        ...prev.boardSettings,
        [boardId]: { ...defaultSettings(boardId), ...prev.boardSettings[boardId], ...patch }
      }
    }));
  }, []);

  const getTasksForBoard = useCallback(
    (boardId) => state.tasks.filter((t) => t.boardId === boardId),
    [state.tasks]
  );

  const moveTask = useCallback((taskId, columnId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, columnId } : t))
    }));
  }, []);

  const updateTask = useCallback((taskId, patch) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t))
    }));
  }, []);

  const addTask = useCallback((boardId, columnId, partial = {}) => {
    const id = `t-${Date.now()}`;
    const task = {
      id,
      boardId,
      columnId,
      title: partial.title || 'Nueva tarea',
      description: partial.description || '',
      priority: partial.priority || 'medium',
      labels: partial.labels || [],
      assigneeId: partial.assigneeId ?? null,
      dueDate: partial.dueDate || '',
      storyPoints: partial.storyPoints ?? 1,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, task] }));
    return task;
  }, []);

  const archiveTask = useCallback((taskId) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId)
    }));
  }, []);

  const duplicateTask = useCallback((taskId) => {
    const original = state.tasks.find((t) => t.id === taskId);
    if (!original) return null;
    const copy = {
      ...original,
      id: `t-${Date.now()}`,
      title: `${original.title} (copia)`,
      columnId: 'todo'
    };
    setState((prev) => ({ ...prev, tasks: [...prev.tasks, copy] }));
    return copy;
  }, [state.tasks]);

  const applyTemplate = useCallback((boardId, templateId) => {
    const tpl = BOARD_TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    updateBoardSettings(boardId, { template: templateId, visibleColumns: [...tpl.columns] });
  }, [updateBoardSettings]);

  const boards = useMemo(() => state.boards, [state.boards]);

  return {
    boards,
    getBoardSettings,
    updateBoardSettings,
    getTasksForBoard,
    moveTask,
    updateTask,
    addTask,
    archiveTask,
    duplicateTask,
    applyTemplate,
    columnDefs: COLUMN_DEFS
  };
}

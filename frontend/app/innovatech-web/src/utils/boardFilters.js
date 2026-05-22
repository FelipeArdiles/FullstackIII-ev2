import { PRIORITIES } from '../data/mockData';

const PRIORITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export function filterAndSortTasks(tasks, filters, members) {
  let list = [...tasks];

  if (filters.search?.trim()) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }

  if (filters.priority && filters.priority !== 'ALL') {
    list = list.filter((t) => t.priority === filters.priority);
  }

  if (filters.assignee && filters.assignee !== 'ALL') {
    if (filters.assignee === 'ME') {
      list = list.filter((t) => t.assigneeId === 101);
    } else {
      list = list.filter((t) => String(t.assigneeId) === filters.assignee);
    }
  }

  if (filters.label && filters.label !== 'ALL') {
    list = list.filter((t) => (t.labels || []).includes(filters.label));
  }

  if (filters.quick === 'high') {
    list = list.filter((t) => t.priority === 'critical' || t.priority === 'high');
  }
  if (filters.quick === 'week') {
    const now = new Date();
    const week = new Date(now);
    week.setDate(week.getDate() + 7);
    list = list.filter((t) => {
      if (!t.dueDate) return false;
      const d = new Date(t.dueDate);
      return d >= now && d <= week;
    });
  }
  if (filters.quick === 'unassigned') {
    list = list.filter((t) => !t.assigneeId);
  }
  if (filters.quick === 'clear') {
    /* handled by parent resetting filters */
  }

  const sort = filters.sort || 'priority';
  list.sort((a, b) => {
    if (sort === 'priority') {
      return (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9);
    }
    if (sort === 'dueDate') {
      return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
    }
    if (sort === 'assignee') {
      const na = members.find((m) => m.id === a.assigneeId)?.name || 'zzz';
      const nb = members.find((m) => m.id === b.assigneeId)?.name || 'zzz';
      return na.localeCompare(nb);
    }
    if (sort === 'title') {
      return a.title.localeCompare(b.title);
    }
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });

  return list;
}

export function groupTasks(tasks, groupBy, members, labels) {
  if (!groupBy || groupBy === 'none') return [{ key: 'all', label: null, tasks }];

  if (groupBy === 'priority') {
    return PRIORITIES.map((p) => ({
      key: p.id,
      label: p.label,
      tasks: tasks.filter((t) => t.priority === p.id)
    })).filter((g) => g.tasks.length > 0);
  }

  if (groupBy === 'assignee') {
    const groups = members.map((m) => ({
      key: String(m.id),
      label: m.name,
      tasks: tasks.filter((t) => t.assigneeId === m.id)
    }));
    const unassigned = tasks.filter((t) => !t.assigneeId);
    if (unassigned.length) {
      groups.push({ key: 'none', label: 'Sin asignar', tasks: unassigned });
    }
    return groups.filter((g) => g.tasks.length > 0);
  }

  if (groupBy === 'label') {
    return labels
      .map((l) => ({
        key: l.id,
        label: l.name,
        tasks: tasks.filter((t) => (t.labels || []).includes(l.id))
      }))
      .filter((g) => g.tasks.length > 0);
  }

  return [{ key: 'all', label: null, tasks }];
}

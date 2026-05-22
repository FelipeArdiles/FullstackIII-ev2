import { useCallback, useEffect, useState } from 'react';
import { MOCK_TEAMS, MOCK_PROJECT_TASKS } from '../data/mockCatalog';

const STORAGE_KEY = 'innovatech-workspace-v1';

function loadWorkspace() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        teams: parsed.teams ?? MOCK_TEAMS,
        projectTasks: parsed.projectTasks ?? MOCK_PROJECT_TASKS
      };
    }
  } catch {
    /* ignore */
  }
  return { teams: [...MOCK_TEAMS], projectTasks: [...MOCK_PROJECT_TASKS] };
}

export function useProjectWorkspace() {
  const [state, setState] = useState(loadWorkspace);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const getTeamsForProject = useCallback(
    (projectId) => state.teams.filter((t) => t.projectId === Number(projectId)),
    [state.teams]
  );

  const getTasksForProject = useCallback(
    (projectId) => state.projectTasks.filter((t) => t.projectId === Number(projectId)),
    [state.projectTasks]
  );

  const assignTaskToUser = useCallback((taskId, assigneeId) => {
    setState((prev) => ({
      ...prev,
      projectTasks: prev.projectTasks.map((t) =>
        t.id === taskId ? { ...t, assigneeId: assigneeId || null } : t
      )
    }));
  }, []);

  const assignTaskToTeam = useCallback((taskId, teamId) => {
    setState((prev) => ({
      ...prev,
      projectTasks: prev.projectTasks.map((t) =>
        t.id === taskId ? { ...t, teamId: teamId || null } : t
      )
    }));
  }, []);

  const addMemberToTeam = useCallback((teamId, memberId) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) => {
        if (t.id !== teamId) return t;
        if (t.memberIds.includes(memberId)) return t;
        return { ...t, memberIds: [...t.memberIds, memberId] };
      })
    }));
  }, []);

  const removeMemberFromTeam = useCallback((teamId, memberId) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((t) =>
        t.id === teamId ? { ...t, memberIds: t.memberIds.filter((id) => id !== memberId) } : t
      )
    }));
  }, []);

  const updateTaskStatus = useCallback((taskId, status) => {
    setState((prev) => ({
      ...prev,
      projectTasks: prev.projectTasks.map((t) => (t.id === taskId ? { ...t, status } : t))
    }));
  }, []);

  return {
    getTeamsForProject,
    getTasksForProject,
    assignTaskToUser,
    assignTaskToTeam,
    addMemberToTeam,
    removeMemberFromTeam,
    updateTaskStatus,
    allTeams: state.teams,
    allProjectTasks: state.projectTasks
  };
}

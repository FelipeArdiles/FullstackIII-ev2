import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProjectSelectionSubject } from '@innovatech/ui-project-card';
import { CompositeForm, FormField } from '@innovatech/ui-capacity-form';
import {
  fetchProjects,
  fetchMembers,
  fetchProjectDetail,
  createProject,
  createMember,
  updateProject
} from './api/bffClient';
import Navbar from './components/layout/Navbar';
import ToastStack from './components/ToastStack';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useBoardState } from './hooks/useBoardState';
import { useProjectWorkspace } from './hooks/useProjectWorkspace';
import { MOCK_PROJECTS, getProjectById } from './data/mockCatalog';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import BoardsListPage from './pages/BoardsListPage';
import BoardPage from './pages/BoardPage';
import SearchPage from './pages/SearchPage';
import TeamPage from './pages/TeamPage';

const selectionSubject = new ProjectSelectionSubject();

export default function App() {
  const { dark, toggle: toggleTheme } = useTheme();
  const { toasts, push: toast, dismiss } = useToast();
  const boardState = useBoardState();
  const workspace = useProjectWorkspace();

  const [view, setView] = useState('dashboard');
  const [activeBoardId, setActiveBoardId] = useState(null);

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [memberForm, setMemberForm] = useState({ name: '', role: '', email: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setError('');
      const [p, m] = await Promise.all([fetchProjects(), fetchMembers()]);
      setProjects(p);
      setMembers(m);
    } catch (e) {
      setError(e.message);
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    load();
    return selectionSubject.subscribe(async (id) => {
      setSelectedId(id);
      if (id) {
        try {
          const d = await fetchProjectDetail(id);
          setDetail(d);
          setEditForm({ name: d.project?.name || '', description: d.project?.description || '' });
        } catch {
          setDetail(null);
        }
      } else {
        setDetail(null);
      }
    });
  }, [load]);

  const catalogProjects = useMemo(() => {
    const merged = [...MOCK_PROJECTS];
    projects.forEach((p) => {
      if (!merged.some((m) => m.id === p.id)) {
        merged.push({
          id: p.id,
          code: `PRJ-${String(p.id).padStart(3, '0')}`,
          name: p.name,
          client: 'API / BFF',
          status: (p.status || 'PLANNED').toUpperCase(),
          budget: '—',
          leadId: 101,
          startDate: '—',
          endDate: '—',
          description: p.description || '',
          tags: ['Live'],
          objectives: []
        });
      }
    });
    return merged;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (statusFilter === 'ALL') return catalogProjects;
    return catalogProjects.filter((p) => (p.status || '').toUpperCase() === statusFilter);
  }, [catalogProjects, statusFilter]);

  const selectedCatalogProject = useMemo(() => {
    if (!selectedId) return null;
    return getProjectById(selectedId) || catalogProjects.find((p) => p.id === selectedId) || null;
  }, [selectedId, catalogProjects]);

  const membersByProject = useMemo(() => {
    if (!selectedId) return [];
    return members.filter((m) => (m.projectIds || []).includes(selectedId));
  }, [members, selectedId]);

  const taskCounts = useMemo(() => {
    const counts = {};
    boardState.boards.forEach((b) => {
      counts[b.id] = boardState.getTasksForBoard(b.id).length;
    });
    return counts;
  }, [boardState]);

  const activeBoard = boardState.boards.find((b) => b.id === activeBoardId);

  const navigate = (v) => {
    setView(v);
    if (v !== 'board') setActiveBoardId(null);
  };

  const openBoard = (id) => {
    setActiveBoardId(id);
    setView('board');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const form = new CompositeForm([
      Object.assign(new FormField('name'), { value: projectForm.name }),
      Object.assign(new FormField('description'), { value: projectForm.description })
    ]);
    const validation = form.validate();
    if (!validation.valid) {
      toast(validation.errors.join(', '), 'error');
      return;
    }
    try {
      await createProject({ name: projectForm.name, description: projectForm.description, initialStatus: 'PLANNED' });
      setProjectForm({ name: '', description: '' });
      toast('Proyecto creado', 'success');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleCreateMember = async (e) => {
    e.preventDefault();
    const form = new CompositeForm([
      Object.assign(new FormField('name'), { value: memberForm.name }),
      Object.assign(new FormField('role'), { value: memberForm.role }),
      Object.assign(new FormField('email', true, 'email'), { value: memberForm.email })
    ]);
    const validation = form.validate();
    if (!validation.valid) {
      toast(validation.errors.join(', '), 'error');
      return;
    }
    try {
      await createMember({ ...memberForm, weeklyHours: 40 });
      setMemberForm({ name: '', role: '', email: '' });
      toast('Miembro registrado', 'success');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    try {
      await updateProject(selectedId, { name: editForm.name, description: editForm.description });
      toast('Proyecto actualizado', 'success');
      await load();
      const d = await fetchProjectDetail(selectedId);
      setDetail(d);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const currentView = view === 'board' ? 'board' : view;

  return (
    <div className="app-shell">
      <Navbar
        currentView={currentView}
        onNavigate={navigate}
        dark={dark}
        onToggleTheme={toggleTheme}
      />

      <main className="app-main app-main--wide">
        {loading ? (
          <div className="loading-state" role="status">
            <span className="spinner" />
            <p>Cargando datos del BFF…</p>
          </div>
        ) : (
          <>
            {error && <p className="error-banner">{error}</p>}

            {view === 'dashboard' && (
              <HomePage
                projects={projects}
                members={members}
                onNavigate={navigate}
                onOpenBoard={openBoard}
              />
            )}

            {view === 'projects' && (
              <ProjectsPage
                catalogProjects={catalogProjects}
                members={members}
                filteredProjects={filteredProjects}
                statusFilter={statusFilter}
                onStatusFilter={setStatusFilter}
                projectForm={projectForm}
                onProjectFormChange={setProjectForm}
                memberForm={memberForm}
                onMemberFormChange={setMemberForm}
                onCreateProject={handleCreateProject}
                onCreateMember={handleCreateMember}
                selectedId={selectedId}
                selectionSubject={selectionSubject}
                selectedCatalogProject={selectedCatalogProject}
                apiDetail={detail}
                workspace={workspace}
                editForm={editForm}
                onEditChange={setEditForm}
                onSaveProject={selectedId && projects.some((p) => p.id === selectedId) ? handleSaveProject : null}
                saving={saving}
                membersByProject={membersByProject}
                toast={toast}
              />
            )}

            {view === 'boards' && (
              <BoardsListPage
                boards={boardState.boards}
                taskCounts={taskCounts}
                onOpenBoard={openBoard}
              />
            )}

            {view === 'board' && activeBoard && (
              <BoardPage
                board={activeBoard}
                boardState={{ ...boardState, onBack: () => navigate('boards') }}
                toast={toast}
              />
            )}

            {view === 'search' && <SearchPage apiProjects={projects} />}

            {view === 'team' && <TeamPage members={members} />}
          </>
        )}
      </main>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

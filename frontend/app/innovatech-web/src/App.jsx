import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProjectSelectionSubject } from '@innovatech/ui-project-card';
import { CompositeForm, FormField, capacityBadge } from '@innovatech/ui-capacity-form';
import { Button } from '@innovatech/ui-button';
import {
  fetchProjects,
  fetchMembers,
  fetchProjectDetail,
  fetchTasksStub,
  createProject,
  createMember,
  updateProject
} from './api/bffClient';
import Dashboard from './components/Dashboard';
import ProjectDetailPanel from './components/ProjectDetailPanel';
import ToastStack from './components/ToastStack';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';

const selectionSubject = new ProjectSelectionSubject();

const STATUS_FILTERS = [
  { value: 'ALL', label: 'Todos' },
  { value: 'PLANNED', label: 'Planificados' },
  { value: 'IN_PROGRESS', label: 'En progreso' },
  { value: 'COMPLETED', label: 'Completados' }
];

export default function App() {
  const { dark, toggle: toggleTheme } = useTheme();
  const { toasts, push: toast, dismiss } = useToast();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [tasksStub, setTasksStub] = useState([]);
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
      const [p, m, t] = await Promise.all([fetchProjects(), fetchMembers(), fetchTasksStub()]);
      setProjects(p);
      setMembers(m);
      setTasksStub(t);
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
          setEditForm({
            name: d.project?.name || '',
            description: d.project?.description || ''
          });
        } catch {
          setDetail(null);
        }
      } else {
        setDetail(null);
      }
    });
  }, [load]);

  const filteredProjects = useMemo(() => {
    if (statusFilter === 'ALL') return projects;
    return projects.filter((p) => (p.status || '').toUpperCase() === statusFilter);
  }, [projects, statusFilter]);

  const membersByProject = useMemo(() => {
    if (!selectedId) return [];
    return members.filter((m) => (m.projectIds || []).includes(selectedId));
  }, [members, selectedId]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const form = new CompositeForm([
      Object.assign(new FormField('name'), { value: projectForm.name }),
      Object.assign(new FormField('description'), { value: projectForm.description })
    ]);
    const validation = form.validate();
    if (!validation.valid) {
      const msg = validation.errors.join(', ');
      setError(msg);
      toast(msg, 'error');
      return;
    }
    try {
      await createProject({ name: projectForm.name, description: projectForm.description, initialStatus: 'PLANNED' });
      setProjectForm({ name: '', description: '' });
      toast('Proyecto creado correctamente', 'success');
      await load();
    } catch (err) {
      setError(err.message);
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
      const msg = validation.errors.join(', ');
      setError(msg);
      toast(msg, 'error');
      return;
    }
    try {
      await createMember({ ...memberForm, weeklyHours: 40 });
      setMemberForm({ name: '', role: '', email: '' });
      toast('Miembro registrado', 'success');
      await load();
    } catch (err) {
      setError(err.message);
      toast(err.message, 'error');
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!selectedId) return;
    const form = new CompositeForm([
      Object.assign(new FormField('name'), { value: editForm.name }),
      Object.assign(new FormField('description'), { value: editForm.description })
    ]);
    const validation = form.validate();
    if (!validation.valid) {
      toast(validation.errors.join(', '), 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProject(selectedId, {
        name: editForm.name,
        description: editForm.description
      });
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

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-brand">
          <span className="logo-mark" aria-hidden="true">IN</span>
          <div>
            <p className="header-eyebrow">Innovatech Solutions</p>
            <h1>Gestión de proyectos y capacidad</h1>
          </div>
        </div>
        <nav className="header-actions">
          <Button variant="secondary" label={dark ? 'Modo claro' : 'Modo oscuro'} onClick={toggleTheme} />
        </nav>
      </header>

      <main className="app-main">
        {loading ? (
          <div className="loading-state" role="status">
            <span className="spinner" />
            <p>Cargando datos del BFF…</p>
          </div>
        ) : (
          <>
            <Dashboard projects={projects} members={members} />
            {error && <p className="error-banner">{error}</p>}

            <div className="grid">
              <section className="panel">
                <div className="panel-head">
                  <h2>Proyectos</h2>
                  <select
                    className="filter-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filtrar por estado"
                  >
                    {STATUS_FILTERS.map((f) => (
                      <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                  </select>
                </div>
                <form onSubmit={handleCreateProject} className="inline-form">
                  <input placeholder="Nombre *" value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
                  <textarea placeholder="Descripción *" rows={2} value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
                  <Button type="submit" variant="primary" label="Crear proyecto" />
                </form>
                {filteredProjects.length === 0 ? (
                  <p className="empty-state">No hay proyectos con este filtro. Crea uno nuevo arriba.</p>
                ) : (
                  filteredProjects.map((p) => (
                    <article
                      key={p.id}
                      className={`project-card ${selectedId === p.id ? 'selected' : ''}`}
                      onClick={() => selectionSubject.select(p.id)}
                      onKeyDown={(e) => e.key === 'Enter' && selectionSubject.select(p.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <strong>{p.name}</strong>
                      <p>{p.description}</p>
                      <span className={`badge badge--${(p.status || 'planned').toLowerCase()}`}>{p.status}</span>
                    </article>
                  ))
                )}
              </section>

              <section className="panel">
                <div className="panel-head">
                  <h2>Recursos y capacidad</h2>
                </div>
                <form onSubmit={handleCreateMember} className="inline-form">
                  <input placeholder="Nombre *" value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })} />
                  <input placeholder="Rol *" value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })} />
                  <input placeholder="Email *" type="email" value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })} />
                  <Button type="submit" variant="secondary" label="Registrar miembro" />
                </form>
                {selectedId && membersByProject.length > 0 && (
                  <p className="member-filter-hint">
                    Mostrando {membersByProject.length} miembro(s) del proyecto seleccionado
                  </p>
                )}
                {members.length === 0 ? (
                  <p className="empty-state">Sin miembros registrados. Agrega el primero con el formulario.</p>
                ) : (
                  (selectedId ? membersByProject : members).map((m) => {
                    const cap = capacityBadge(m.availableCapacityPercent ?? 0);
                    return (
                      <div key={m.id} className="member-row">
                        <div>
                          <strong>{m.name}</strong>
                          <span className="member-role">{m.role}</span>
                          <div className="capacity-bar">
                            <div
                              className="capacity-bar-fill"
                              style={{ width: `${m.availableCapacityPercent ?? 0}%` }}
                            />
                          </div>
                          <small className={`capacity-label capacity-label--${cap.level}`}>{cap.label}</small>
                        </div>
                      </div>
                    );
                  })
                )}
              </section>
            </div>

            {detail && (
              <ProjectDetailPanel
                detail={detail}
                editForm={editForm}
                onEditChange={setEditForm}
                onSave={handleSaveProject}
                saving={saving}
              />
            )}

            {tasksStub.length > 0 && (
              <section className="panel tasks-stub-panel">
                <h2>Tareas (stub BFF – EV3)</h2>
                <ul className="tasks-stub-list">
                  {tasksStub.map((t) => (
                    <li key={t.id}>
                      <strong>{t.title}</strong>
                      <span className={`badge badge--${String(t.status).toLowerCase()}`}>{t.status}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

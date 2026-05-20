import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProjectSelectionSubject } from '@innovatech/ui-project-card';
import { CompositeForm, FormField, capacityBadge } from '@innovatech/ui-capacity-form';
import { fetchProjects, fetchMembers, fetchProjectDetail, createProject, createMember } from './api/bffClient';
import Dashboard from './components/Dashboard';
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
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
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
      Object.assign(new FormField('email'), { value: memberForm.email })
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
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-pressed={dark}>
            {dark ? 'Modo claro' : 'Modo oscuro'}
          </button>
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
                  <button type="submit" className="innovatech-btn innovatech-btn--primary">Crear proyecto</button>
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
                  <button type="submit" className="innovatech-btn innovatech-btn--secondary">Registrar miembro</button>
                </form>
                {members.length === 0 ? (
                  <p className="empty-state">Sin miembros registrados. Agrega el primero con el formulario.</p>
                ) : (
                  members.map((m) => {
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
              <section className="panel detail-panel">
                <h2>Detalle del proyecto (BFF)</h2>
                <p><strong>{detail.project?.name}</strong></p>
                <p>Capacidad promedio del equipo: <strong>{detail.averageCapacityPercent?.toFixed(1)}%</strong></p>
                <p>Miembros asignados: {detail.members?.length ?? 0}</p>
              </section>
            )}
          </>
        )}
      </main>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
}

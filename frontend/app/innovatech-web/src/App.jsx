import { useCallback, useEffect, useState } from 'react';
import { ProjectSelectionSubject } from '@innovatech/ui-project-card';
import { CompositeForm, FormField, capacityBadge } from '@innovatech/ui-capacity-form';
import { fetchProjects, fetchMembers, fetchProjectDetail, createProject, createMember } from './api/bffClient';

const selectionSubject = new ProjectSelectionSubject();

export default function App() {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [memberForm, setMemberForm] = useState({ name: '', role: '', email: '' });

  const load = useCallback(async () => {
    try {
      setError('');
      const [p, m] = await Promise.all([fetchProjects(), fetchMembers()]);
      setProjects(p);
      setMembers(m);
    } catch (e) {
      setError(e.message);
    }
  }, []);

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
      }
    });
  }, [load]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const form = new CompositeForm([
      Object.assign(new FormField('name'), { value: projectForm.name }),
      Object.assign(new FormField('description'), { value: projectForm.description })
    ]);
    const validation = form.validate();
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }
    try {
      await createProject({ name: projectForm.name, description: projectForm.description, initialStatus: 'PLANNED' });
      setProjectForm({ name: '', description: '' });
      await load();
    } catch (err) {
      setError(err.message);
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
      setError(validation.errors.join(', '));
      return;
    }
    try {
      await createMember({ ...memberForm, weeklyHours: 40 });
      setMemberForm({ name: '', role: '', email: '' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="app-header">
        <h1>Innovatech Solutions – Gestión de proyectos y capacidad</h1>
      </header>
      <main>
        {error && <p className="error">{error}</p>}
        <div className="grid">
          <section className="panel">
            <h2>Proyectos</h2>
            <form onSubmit={handleCreateProject}>
              <input placeholder="Nombre *" value={projectForm.name}
                onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} />
              <textarea placeholder="Descripción *" value={projectForm.description}
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} />
              <button type="submit" className="innovatech-btn innovatech-btn--primary">Crear proyecto</button>
            </form>
            {projects.map(p => (
              <article
                key={p.id}
                className={`project-card ${selectedId === p.id ? 'selected' : ''}`}
                onClick={() => selectionSubject.select(p.id)}
              >
                <strong>{p.name}</strong>
                <p>{p.description}</p>
                <span className={`badge badge--${(p.status || 'planned').toLowerCase()}`}>{p.status}</span>
              </article>
            ))}
          </section>
          <section className="panel">
            <h2>Recursos y capacidad</h2>
            <form onSubmit={handleCreateMember}>
              <input placeholder="Nombre *" value={memberForm.name}
                onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} />
              <input placeholder="Rol *" value={memberForm.role}
                onChange={e => setMemberForm({ ...memberForm, role: e.target.value })} />
              <input placeholder="Email *" type="email" value={memberForm.email}
                onChange={e => setMemberForm({ ...memberForm, email: e.target.value })} />
              <button type="submit" className="innovatech-btn innovatech-btn--secondary">Registrar miembro</button>
            </form>
            {members.map(m => {
              const cap = capacityBadge(m.availableCapacityPercent ?? 0);
              return (
                <div key={m.id} className="member-row">
                  <div>
                    <strong>{m.name}</strong> – {m.role}
                    <div className="capacity-bar">
                      <div className="capacity-bar-fill" style={{ width: `${m.availableCapacityPercent ?? 0}%` }} />
                    </div>
                    <small>{cap.label}</small>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
        {detail && (
          <section className="panel" style={{ marginTop: '1.5rem' }}>
            <h2>Detalle del proyecto (BFF)</h2>
            <p><strong>{detail.project?.name}</strong> – Capacidad promedio del equipo: {detail.averageCapacityPercent?.toFixed(1)}%</p>
            <p>Miembros asignados: {detail.members?.length ?? 0}</p>
          </section>
        )}
      </main>
    </>
  );
}

import { useState, useMemo } from 'react';
import { capacityBadge } from '@innovatech/ui-capacity-form';
import { MOCK_MEMBERS } from '../data/mockCatalog';

export default function TeamPage({ members = [] }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const roster = useMemo(() => {
    const apiExtra = members
      .filter((m) => !MOCK_MEMBERS.some((x) => x.email === m.email))
      .map((m) => ({
        id: m.id,
        name: m.name,
        role: m.role,
        email: m.email,
        avatar: m.name?.slice(0, 2).toUpperCase() || '??',
        department: 'API',
        availableCapacityPercent: m.availableCapacityPercent ?? 50
      }));
    return [...MOCK_MEMBERS, ...apiExtra];
  }, [members]);

  const departments = useMemo(
    () => ['ALL', ...new Set(roster.map((m) => m.department))],
    [roster]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roster.filter((m) => {
      if (deptFilter !== 'ALL' && m.department !== deptFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    });
  }, [roster, search, deptFilter]);

  return (
    <section className="page-section">
      <div className="page-head">
        <h2>Equipo ({roster.length} colaboradores)</h2>
        <p className="page-subtitle">30 usuarios ficticios + recursos del BFF. Asignables a equipos y tareas en la ficha de cada proyecto.</p>
      </div>
      <div className="search-bar panel team-filters">
        <input
          type="search"
          placeholder="Buscar por nombre, rol o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label>
          Área
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            {departments.map((d) => (
              <option key={d} value={d}>{d === 'ALL' ? 'Todas' : d}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="search-count">{filtered.length} mostrados</p>
      <div className="team-grid">
        {filtered.map((m) => {
          const cap = capacityBadge(m.availableCapacityPercent ?? 72);
          return (
            <article key={m.id} className="team-card panel">
              <span className="avatar avatar--lg">{m.avatar}</span>
              <h3>{m.name}</h3>
              <p className="member-role">{m.role}</p>
              <p className="team-email">{m.email}</p>
              <span className="tech-tag">{m.department}</span>
              <div className="capacity-bar">
                <div className="capacity-bar-fill" style={{ width: `${m.availableCapacityPercent ?? 72}%` }} />
              </div>
              <small className={`capacity-label capacity-label--${cap.level}`}>{cap.label}</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}

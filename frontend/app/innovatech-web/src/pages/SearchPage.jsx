import { useMemo, useState } from 'react';
import { MOCK_PROJECTS_SEARCH } from '../data/mockData';

export default function SearchPage({ apiProjects = [] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [client, setClient] = useState('ALL');

  const catalog = useMemo(() => {
    const merged = [...MOCK_PROJECTS_SEARCH];
    apiProjects.forEach((p) => {
      if (!merged.some((m) => m.id === p.id)) {
        merged.push({
          id: p.id,
          code: `PRJ-${String(p.id).padStart(3, '0')}`,
          name: p.name,
          client: 'API / BFF',
          status: p.status || 'PLANNED',
          budget: '—',
          lead: '—',
          startDate: '—',
          endDate: '—',
          description: p.description || '',
          tags: ['Live']
        });
      }
    });
    return merged;
  }, [apiProjects]);

  const clients = useMemo(
    () => ['ALL', ...new Set(catalog.map((p) => p.client))],
    [catalog]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((p) => {
      if (status !== 'ALL' && (p.status || '').toUpperCase() !== status) return false;
      if (client !== 'ALL' && p.client !== client) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.client.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [catalog, query, status, client]);

  return (
    <section className="page-section">
      <div className="page-head">
        <h2>Buscar proyectos</h2>
        <p className="page-subtitle">
          Consulta por código, nombre, cliente, tecnologías o descripción (datos ficticios + API).
        </p>
      </div>
      <div className="search-bar panel">
        <input
          type="search"
          className="search-input-lg"
          placeholder="Ej: Portal, Data Lake, React…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar proyectos"
        />
        <label>
          Estado
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">Todos</option>
            <option value="PLANNED">Planificado</option>
            <option value="IN_PROGRESS">En progreso</option>
            <option value="COMPLETED">Completado</option>
          </select>
        </label>
        <label>
          Cliente
          <select value={client} onChange={(e) => setClient(e.target.value)}>
            {clients.map((c) => (
              <option key={c} value={c}>{c === 'ALL' ? 'Todos' : c}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="search-count">{results.length} resultado(s)</p>
      <div className="search-results">
        {results.map((p) => (
          <article key={p.id} className="search-card panel">
            <div className="search-card-head">
              <span className="project-code">{p.code}</span>
              <span className={`badge badge--${(p.status || 'planned').toLowerCase()}`}>{p.status}</span>
            </div>
            <h3>{p.name}</h3>
            <p className="search-client"><strong>Cliente:</strong> {p.client}</p>
            <p>{p.description}</p>
            <dl className="search-meta">
              <div><dt>Líder</dt><dd>{p.lead}</dd></div>
              <div><dt>Presupuesto</dt><dd>{p.budget}</dd></div>
              <div><dt>Inicio</dt><dd>{p.startDate}</dd></div>
              <div><dt>Fin</dt><dd>{p.endDate}</dd></div>
            </dl>
            <div className="tag-row">
              {(p.tags || []).map((t) => (
                <span key={t} className="tech-tag">{t}</span>
              ))}
            </div>
          </article>
        ))}
        {results.length === 0 && (
          <p className="empty-state">No hay proyectos que coincidan con la búsqueda.</p>
        )}
      </div>
    </section>
  );
}

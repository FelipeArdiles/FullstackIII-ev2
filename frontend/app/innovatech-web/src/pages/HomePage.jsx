import { Button } from '@innovatech/ui-button';
import Dashboard from '../components/Dashboard';
import { MOCK_BOARDS, MOCK_PROJECTS_SEARCH, MOCK_MEMBERS } from '../data/mockData';

export default function HomePage({ projects, members, onNavigate, onOpenBoard }) {
  return (
    <section className="page-section">
      <Dashboard projects={MOCK_PROJECTS_SEARCH} members={MOCK_MEMBERS} />
      <div className="home-quick panel">
        <h2>Accesos rápidos</h2>
        <div className="quick-grid">
          <Button variant="primary" label="Ver tableros" onClick={() => onNavigate('boards')} />
          <Button variant="secondary" label="Buscar proyectos" onClick={() => onNavigate('search')} />
          <Button variant="secondary" label="Gestionar proyectos" onClick={() => onNavigate('projects')} />
          <Button variant="secondary" label="Ver equipo" onClick={() => onNavigate('team')} />
        </div>
      </div>
      <div className="home-preview grid">
        <section className="panel">
          <h3>Tableros destacados</h3>
          <ul className="home-list">
            {MOCK_BOARDS.filter((b) => b.favorite).map((b) => (
              <li key={b.id}>
                <button type="button" className="link-btn" onClick={() => onOpenBoard(b.id)}>
                  {b.name}
                </button>
                <span className="board-type board-type--inline">{b.type}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel">
          <h3>Proyectos activos (muestra)</h3>
          <ul className="home-list">
            {MOCK_PROJECTS_SEARCH.filter((p) => p.status === 'IN_PROGRESS').slice(0, 4).map((p) => (
              <li key={p.id}>
                <strong>{p.code}</strong> — {p.name}
                <span className="search-client">{p.client}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

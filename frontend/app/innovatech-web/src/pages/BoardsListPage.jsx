import { Button } from '@innovatech/ui-button';
import { MOCK_BOARDS } from '../data/mockData';

export default function BoardsListPage({ boards, taskCounts, onOpenBoard }) {
  const list = boards.length ? boards : MOCK_BOARDS;
  return (
    <section className="page-section">
      <div className="page-head">
        <h2>Tableros Kanban / Scrum</h2>
        <p className="page-subtitle">
          Gestiona el flujo de trabajo por proyecto. Selecciona un tablero para ver columnas, WIP y tarjetas.
        </p>
      </div>
      <div className="boards-grid">
        {list.map((b) => (
          <article key={b.id} className="board-card panel">
            {b.favorite && <span className="board-fav">★ Favorito</span>}
            <span className={`board-type board-type--${b.type.toLowerCase()}`}>{b.type}</span>
            <h3>{b.name}</h3>
            <p className="board-project">{b.projectName}</p>
            <p className="board-desc">{b.description}</p>
            <p className="board-stats">{taskCounts[b.id] ?? 0} tarjetas activas</p>
            <Button variant="primary" label="Abrir tablero" onClick={() => onOpenBoard(b.id)} />
          </article>
        ))}
      </div>
    </section>
  );
}

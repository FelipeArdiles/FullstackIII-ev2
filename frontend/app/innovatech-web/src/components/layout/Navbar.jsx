import { Button } from '@innovatech/ui-button';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Inicio', icon: '⌂' },
  { id: 'projects', label: 'Proyectos', icon: '◫' },
  { id: 'boards', label: 'Tableros', icon: '▦' },
  { id: 'search', label: 'Buscar', icon: '⌕' },
  { id: 'team', label: 'Equipo', icon: '👥' }
];

export default function Navbar({ currentView, onNavigate, dark, onToggleTheme }) {
  const isBoards = currentView === 'board' || currentView === 'boards';
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="logo-mark" aria-hidden="true">IN</span>
        <div>
          <p className="header-eyebrow">Innovatech Solutions</p>
          <h1>Gestión de proyectos</h1>
        </div>
      </div>
      <nav className="main-nav" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link ${
              currentView === item.id || (item.id === 'boards' && isBoards) ? 'nav-link--active' : ''
            }`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <nav className="header-actions">
        <Button variant="secondary" label={dark ? '☀ Claro' : '☾ Oscuro'} onClick={onToggleTheme} />
      </nav>
    </header>
  );
}

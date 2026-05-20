export default function Dashboard({ projects, members }) {
  const avgCapacity =
    members.length > 0
      ? members.reduce((s, m) => s + (m.availableCapacityPercent ?? 0), 0) / members.length
      : 0;
  const inProgress = projects.filter((p) => (p.status || '').toUpperCase() === 'IN_PROGRESS').length;

  return (
    <section className="dashboard" aria-label="Resumen">
      <article className="stat-card">
        <span className="stat-label">Proyectos</span>
        <strong className="stat-value">{projects.length}</strong>
        <small>{inProgress} en progreso</small>
      </article>
      <article className="stat-card">
        <span className="stat-label">Miembros</span>
        <strong className="stat-value">{members.length}</strong>
        <small>equipo activo</small>
      </article>
      <article className="stat-card stat-card--accent">
        <span className="stat-label">Capacidad media</span>
        <strong className="stat-value">{avgCapacity.toFixed(0)}%</strong>
        <div className="capacity-chart" aria-hidden="true">
          {members.slice(0, 6).map((m) => (
            <div
              key={m.id}
              className="capacity-chart-bar"
              style={{ height: `${Math.max(8, m.availableCapacityPercent ?? 0)}%` }}
              title={`${m.name}: ${m.availableCapacityPercent ?? 0}%`}
            />
          ))}
        </div>
      </article>
    </section>
  );
}

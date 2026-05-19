/**
 * Patrón Observer: notifica cambios de selección de proyecto.
 */
export class ProjectSelectionSubject {
  constructor() {
    this.observers = [];
    this.selectedId = null;
  }
  subscribe(fn) {
    this.observers.push(fn);
    return () => {
      this.observers = this.observers.filter(o => o !== fn);
    };
  }
  select(projectId) {
    this.selectedId = projectId;
    this.observers.forEach(fn => fn(projectId));
  }
}

export function renderProjectCard(project, container) {
  const card = document.createElement('article');
  card.className = 'innovatech-project-card';
  const name = escapeHtml(project.name);
  const desc = escapeHtml(project.description || '');
  const status = project.status || 'PLANNED';
  card.innerHTML = `
    <h3>${name}</h3>
    <p>${desc}</p>
    <span class="badge badge--${status.toLowerCase()}">${status}</span>
  `;
  container.appendChild(card);
  return card;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

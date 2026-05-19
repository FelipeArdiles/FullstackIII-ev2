const BASE = '/api/bff';

export async function fetchProjects() {
  const res = await fetch(`${BASE}/projects`);
  if (!res.ok) throw new Error('Error al cargar proyectos');
  return res.json();
}

export async function fetchMembers() {
  const res = await fetch(`${BASE}/members`);
  if (!res.ok) throw new Error('Error al cargar miembros');
  return res.json();
}

export async function fetchProjectDetail(id) {
  const res = await fetch(`${BASE}/projects/${id}/detail`);
  if (!res.ok) throw new Error('Error al cargar detalle');
  return res.json();
}

export async function createProject(data) {
  const res = await fetch(`${BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear proyecto');
  return res.json();
}

export async function createMember(data) {
  const res = await fetch(`${BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear miembro');
  return res.json();
}

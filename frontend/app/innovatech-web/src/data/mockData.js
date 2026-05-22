/** Datos ficticios para tableros, tareas y catálogos (caso Innovatech). */

import { MOCK_PROJECTS } from './mockCatalog';

export {
  MOCK_MEMBERS,
  MOCK_PROJECTS,
  MOCK_TEAMS,
  MOCK_PROJECT_TASKS,
  getMemberById,
  getProjectById,
  getLeadName
} from './mockCatalog';

export const MOCK_PROJECTS_SEARCH = MOCK_PROJECTS;

export const LABELS = [
  { id: 'bug', name: 'Bug', color: '#ef4444' },
  { id: 'feature', name: 'Feature', color: '#3b82f6' },
  { id: 'docs', name: 'Documentación', color: '#8b5cf6' },
  { id: 'urgent', name: 'Urgente', color: '#f59e0b' },
  { id: 'infra', name: 'Infraestructura', color: '#64748b' },
  { id: 'ux', name: 'UX/UI', color: '#ec4899' }
];

export const PRIORITIES = [
  { id: 'critical', label: 'Crítica', color: '#dc2626' },
  { id: 'high', label: 'Alta', color: '#ea580c' },
  { id: 'medium', label: 'Media', color: '#ca8a04' },
  { id: 'low', label: 'Baja', color: '#16a34a' }
];

export const COLUMN_DEFS = [
  { id: 'backlog', title: 'Backlog', wipLimit: null },
  { id: 'todo', title: 'Por hacer', wipLimit: 8 },
  { id: 'in_progress', title: 'En progreso', wipLimit: 5 },
  { id: 'review', title: 'Revisión', wipLimit: 4 },
  { id: 'done', title: 'Hecho', wipLimit: null }
];

export const MOCK_BOARDS = [
  {
    id: 'board-1',
    name: 'Portal Clientes – Sprint 12',
    projectId: 1,
    projectName: 'Portal Clientes B2B',
    type: 'SCRUM',
    description: 'Tablero Scrum del portal B2B con entregables del sprint actual.',
    favorite: true
  },
  {
    id: 'board-2',
    name: 'App Móvil – Flujo continuo',
    projectId: 2,
    projectName: 'App Móvil Innovatech',
    type: 'KANBAN',
    description: 'Kanban de releases continuos para iOS y Android.',
    favorite: true
  },
  {
    id: 'board-3',
    name: 'Data Lake – Integración',
    projectId: 3,
    projectName: 'Plataforma Data Lake',
    type: 'KANBAN',
    description: 'Pipeline ETL, calidad de datos y dashboards analíticos.',
    favorite: false
  },
  {
    id: 'board-4',
    name: 'Seguridad – Hardening Q2',
    projectId: 4,
    projectName: 'Programa Zero Trust',
    type: 'CUSTOM',
    description: 'Columnas personalizadas para auditoría y remediación.',
    favorite: false
  }
];

export const MOCK_TASKS = [
  {
    id: 't-1', boardId: 'board-1', columnId: 'in_progress',
    title: 'Implementar login SSO Azure AD',
    description: 'Integración OIDC con redirect y refresh token.',
    priority: 'high', labels: ['feature', 'infra'], assigneeId: 102,
    dueDate: '2026-05-25', storyPoints: 8, createdAt: '2026-05-10'
  },
  {
    id: 't-2', boardId: 'board-1', columnId: 'review',
    title: 'Dashboard de métricas de uso',
    description: 'Gráficos DAU/MAU y embudo de conversión.',
    priority: 'medium', labels: ['feature', 'ux'], assigneeId: 103,
    dueDate: '2026-05-22', storyPoints: 5, createdAt: '2026-05-08'
  },
  {
    id: 't-3', boardId: 'board-1', columnId: 'todo',
    title: 'Corregir timeout en exportación PDF',
    description: 'Reportes > 500 filas fallan en producción.',
    priority: 'critical', labels: ['bug', 'urgent'], assigneeId: 102,
    dueDate: '2026-05-20', storyPoints: 3, createdAt: '2026-05-18'
  },
  {
    id: 't-4', boardId: 'board-1', columnId: 'backlog',
    title: 'Documentar API de facturación',
    description: 'OpenAPI 3.1 + ejemplos Postman.',
    priority: 'low', labels: ['docs'], assigneeId: 105,
    dueDate: '2026-06-01', storyPoints: 2, createdAt: '2026-05-05'
  },
  {
    id: 't-5', boardId: 'board-1', columnId: 'done',
    title: 'Migración a React 18',
    description: 'Actualización de dependencias y pruebas de humo.',
    priority: 'medium', labels: ['feature'], assigneeId: 103,
    dueDate: '2026-05-15', storyPoints: 5, createdAt: '2026-04-28'
  },
  {
    id: 't-6', boardId: 'board-2', columnId: 'in_progress',
    title: 'Push notifications FCM',
    description: 'Registro de device tokens y campañas.',
    priority: 'high', labels: ['feature'], assigneeId: 103,
    dueDate: '2026-05-28', storyPoints: 8, createdAt: '2026-05-12'
  },
  {
    id: 't-7', boardId: 'board-2', columnId: 'todo',
    title: 'Modo offline catálogo productos',
    description: 'SQLite local + sync delta.',
    priority: 'medium', labels: ['feature'], assigneeId: 102,
    dueDate: '2026-06-05', storyPoints: 13, createdAt: '2026-05-14'
  },
  {
    id: 't-8', boardId: 'board-2', columnId: 'review',
    title: 'Pruebas E2E en dispositivos reales',
    description: 'Maestro + Firebase Test Lab.',
    priority: 'high', labels: ['infra'], assigneeId: 104,
    dueDate: '2026-05-24', storyPoints: 5, createdAt: '2026-05-11'
  },
  {
    id: 't-9', boardId: 'board-3', columnId: 'backlog',
    title: 'Ingesta batch desde SAP',
    description: 'Conector nocturno y validación de esquema.',
    priority: 'high', labels: ['infra'], assigneeId: 102,
    dueDate: '2026-06-10', storyPoints: 13, createdAt: '2026-05-01'
  },
  {
    id: 't-10', boardId: 'board-3', columnId: 'in_progress',
    title: 'Catálogo de datasets en Glue',
    description: 'Lineage y permisos por rol.',
    priority: 'medium', labels: ['feature'], assigneeId: 101,
    dueDate: '2026-05-30', storyPoints: 8, createdAt: '2026-05-09'
  },
  {
    id: 't-11', boardId: 'board-4', columnId: 'todo',
    title: 'Escaneo OWASP ZAP en CI',
    description: 'Pipeline en cada PR a main.',
    priority: 'critical', labels: ['urgent', 'infra'], assigneeId: 104,
    dueDate: '2026-05-21', storyPoints: 5, createdAt: '2026-05-16'
  },
  {
    id: 't-12', boardId: 'board-4', columnId: 'done',
    title: 'Rotación de secretos Vault',
    description: 'Política 90 días automatizada.',
    priority: 'high', labels: ['infra'], assigneeId: 102,
    dueDate: '2026-05-18', storyPoints: 3, createdAt: '2026-05-02'
  }
];

export const BOARD_TEMPLATES = [
  { id: 'SCRUM', label: 'Scrum', columns: ['backlog', 'todo', 'in_progress', 'review', 'done'] },
  { id: 'KANBAN', label: 'Kanban clásico', columns: ['todo', 'in_progress', 'review', 'done'] },
  { id: 'CUSTOM', label: 'Personalizado', columns: ['backlog', 'todo', 'in_progress', 'review', 'done'] }
];

export const SORT_OPTIONS = [
  { id: 'priority', label: 'Prioridad' },
  { id: 'dueDate', label: 'Fecha límite' },
  { id: 'assignee', label: 'Asignado' },
  { id: 'created', label: 'Creación' },
  { id: 'title', label: 'Título (A-Z)' }
];

export const GROUP_OPTIONS = [
  { id: 'none', label: 'Sin agrupar' },
  { id: 'assignee', label: 'Por asignado' },
  { id: 'priority', label: 'Por prioridad' },
  { id: 'label', label: 'Por etiqueta' }
];

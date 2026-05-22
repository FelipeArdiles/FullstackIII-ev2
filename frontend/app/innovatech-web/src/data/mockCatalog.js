/** Catálogo ficticio: 30 usuarios, 12 proyectos, equipos y tareas de proyecto. */

const ROLES = [
  'Tech Lead', 'Senior Backend', 'Backend Dev', 'Senior Frontend', 'Frontend Dev',
  'QA Engineer', 'DevOps', 'Product Owner', 'Scrum Master', 'UX Designer',
  'Data Engineer', 'Security Analyst', 'Architect', 'Mobile Dev', 'Fullstack Dev'
];

const FIRST = [
  'Camila', 'Diego', 'Valentina', 'Andrés', 'Javiera', 'Matías', 'Francisca', 'Sebastián',
  'Constanza', 'Felipe', 'Isidora', 'Tomás', 'Catalina', 'Nicolás', 'Antonia', 'Benjamín',
  'Sofía', 'Ignacio', 'Emilia', 'Vicente', 'Amanda', 'Cristóbal', 'Josefa', 'Maximiliano',
  'Renata', 'Gabriel', 'Fernanda', 'Rodrigo', 'Paula', 'Martín'
];

const LAST = [
  'Rojas', 'Muñoz', 'Soto', 'Pérez', 'Núñez', 'Silva', 'Torres', 'Araya', 'Vega', 'Contreras',
  'Flores', 'Espinoza', 'Morales', 'Reyes', 'Fuentes', 'Herrera', 'Castro', 'Vargas', 'Tapia', 'Romero',
  'Gutiérrez', 'Molina', 'Sánchez', 'López', 'Díaz', 'Ramírez', 'Carrasco', 'Ortiz', 'Aguilar', 'Navarro'
];

export const MOCK_MEMBERS = FIRST.map((name, i) => {
  const id = 101 + i;
  const last = LAST[i];
  const role = ROLES[i % ROLES.length];
  const cap = 45 + ((i * 7) % 50);
  return {
    id,
    name: `${name} ${last}`,
    role,
    email: `${name.toLowerCase()}.${last.toLowerCase()}@innovatech.cl`,
    avatar: `${name[0]}${last[0]}`.toUpperCase(),
    department: i < 10 ? 'Ingeniería' : i < 20 ? 'Producto' : 'Operaciones',
    availableCapacityPercent: cap
  };
});

export const MOCK_PROJECTS = [
  { id: 1, code: 'PRJ-001', name: 'Portal Clientes B2B', client: 'RetailMax Chile', status: 'IN_PROGRESS', budget: 'USD 120.000', leadId: 101, startDate: '2026-01-15', endDate: '2026-09-30', description: 'Portal self-service para clientes corporativos con facturación, tickets y reportes.', tags: ['React', 'Java', 'Azure'], objectives: ['Reducir tickets N1 en 30%', 'Onboarding digital de clientes'] },
  { id: 2, code: 'PRJ-002', name: 'App Móvil Innovatech', client: 'Interno', status: 'IN_PROGRESS', budget: 'USD 85.000', leadId: 102, startDate: '2026-02-01', endDate: '2026-11-15', description: 'App para técnicos de campo: órdenes de trabajo, geolocalización y firma digital.', tags: ['Flutter', 'Firebase'], objectives: ['100% trazabilidad en terreno', 'Modo offline'] },
  { id: 3, code: 'PRJ-003', name: 'Plataforma Data Lake', client: 'FinBank', status: 'PLANNED', budget: 'USD 200.000', leadId: 103, startDate: '2026-03-01', endDate: '2026-12-20', description: 'Centralización analítica, ETL y reporting regulatorio CMF.', tags: ['AWS', 'Spark', 'Power BI'], objectives: ['Catálogo de datos único', 'SLA ingestión < 4h'] },
  { id: 4, code: 'PRJ-004', name: 'Programa Zero Trust', client: 'Interno', status: 'IN_PROGRESS', budget: 'USD 65.000', leadId: 104, startDate: '2026-01-20', endDate: '2026-08-30', description: 'Endurecimiento IAM, microsegmentación y rotación de secretos.', tags: ['Security', 'Vault', 'Okta'], objectives: ['MFA obligatorio', 'Cero trust network'] },
  { id: 5, code: 'PRJ-005', name: 'Chatbot Soporte N1', client: 'TeleCom Sur', status: 'COMPLETED', budget: 'USD 45.000', leadId: 105, startDate: '2025-10-01', endDate: '2026-04-01', description: 'Asistente conversacional WhatsApp + CRM Salesforce.', tags: ['NLP', 'Python'], objectives: ['Deflexión 40% consultas', 'CSAT > 4.2'] },
  { id: 6, code: 'PRJ-006', name: 'Modernización ERP Legacy', client: 'AgroExport', status: 'PLANNED', budget: 'USD 350.000', leadId: 101, startDate: '2026-06-01', endDate: '2027-06-30', description: 'Migración gradual SAP → microservicios event-driven.', tags: ['SAP', 'Kubernetes'], objectives: ['Strangler fig pattern', 'Cero downtime fin de semana'] },
  { id: 7, code: 'PRJ-007', name: 'E-commerce B2C', client: 'ModaChile', status: 'IN_PROGRESS', budget: 'USD 95.000', leadId: 106, startDate: '2026-02-15', endDate: '2026-10-30', description: 'Tienda online con pasarela Transbank y logística integrada.', tags: ['Next.js', 'Stripe'], objectives: ['Conversión +15%', 'Core Web Vitals verdes'] },
  { id: 8, code: 'PRJ-008', name: 'Observabilidad Unificada', client: 'Interno', status: 'IN_PROGRESS', budget: 'USD 55.000', leadId: 107, startDate: '2026-01-10', endDate: '2026-07-31', description: 'Stack Grafana + Prometheus + Loki para todos los MS.', tags: ['DevOps', 'Grafana'], objectives: ['MTTR < 30 min', 'SLO 99.9%'] },
  { id: 9, code: 'PRJ-009', name: 'Portal RR.HH.', client: 'Interno', status: 'PLANNED', budget: 'USD 70.000', leadId: 108, startDate: '2026-04-01', endDate: '2026-12-15', description: 'Vacaciones, evaluaciones y onboarding de colaboradores.', tags: ['Vue', 'Spring'], objectives: ['Autoservicio RR.HH.', 'Integración Buk'] },
  { id: 10, code: 'PRJ-010', name: 'API Gateway Corporativo', client: 'Consorcio Financiero', status: 'IN_PROGRESS', budget: 'USD 110.000', leadId: 109, startDate: '2026-01-05', endDate: '2026-08-20', description: 'Kong + rate limiting + OAuth2 para partners externos.', tags: ['Kong', 'OAuth2'], objectives: ['100 partners onboarded', 'Latencia p95 < 120ms'] },
  { id: 11, code: 'PRJ-011', name: 'BI Ventas Regional', client: 'Distribuidora Sur', status: 'IN_PROGRESS', budget: 'USD 60.000', leadId: 110, startDate: '2026-03-10', endDate: '2026-09-01', description: 'Tableros Power BI por zona y fuerza de ventas.', tags: ['Power BI', 'SQL'], objectives: ['Refresh diario 6am', '5 dashboards ejecutivos'] },
  { id: 12, code: 'PRJ-012', name: 'Migración Cloud AWS', client: 'LogísticaPacífico', status: 'PLANNED', budget: 'USD 180.000', leadId: 111, startDate: '2026-05-01', endDate: '2027-02-28', description: 'Lift-and-shift fase 1 + refactor serverless fase 2.', tags: ['AWS', 'Terraform'], objectives: ['-20% costo infra', 'Landing zone segura'] }
];

export const MOCK_TEAMS = [
  { id: 'team-1-a', projectId: 1, name: 'Equipo Alpha – Frontend', memberIds: [101, 103, 109, 115] },
  { id: 'team-1-b', projectId: 1, name: 'Equipo Beta – Backend', memberIds: [102, 107, 112, 118] },
  { id: 'team-2-a', projectId: 2, name: 'Squad Mobile', memberIds: [102, 114, 119, 124] },
  { id: 'team-2-b', projectId: 2, name: 'Squad QA Móvil', memberIds: [104, 120, 125] },
  { id: 'team-3-a', projectId: 3, name: 'Data Engineering', memberIds: [110, 116, 121, 126] },
  { id: 'team-4-a', projectId: 4, name: 'Ciberseguridad', memberIds: [104, 111, 117, 122] },
  { id: 'team-7-a', projectId: 7, name: 'E-commerce Core', memberIds: [106, 113, 123, 128] },
  { id: 'team-8-a', projectId: 8, name: 'SRE Observabilidad', memberIds: [107, 112, 127, 130] },
  { id: 'team-10-a', projectId: 10, name: 'Integración APIs', memberIds: [109, 114, 118, 129] }
];

export const MOCK_PROJECT_TASKS = [
  { id: 'pt-1', projectId: 1, code: 'US-101', title: 'Login SSO corporativo', status: 'IN_PROGRESS', priority: 'high', assigneeId: 102, teamId: 'team-1-b' },
  { id: 'pt-2', projectId: 1, code: 'US-102', title: 'Dashboard de facturación', status: 'TODO', priority: 'medium', assigneeId: 103, teamId: 'team-1-a' },
  { id: 'pt-3', projectId: 1, code: 'US-103', title: 'Exportación masiva PDF', status: 'TODO', priority: 'critical', assigneeId: null, teamId: 'team-1-b' },
  { id: 'pt-4', projectId: 1, code: 'US-104', title: 'Pruebas regresión sprint', status: 'REVIEW', priority: 'high', assigneeId: 104, teamId: 'team-1-a' },
  { id: 'pt-5', projectId: 2, code: 'US-201', title: 'Sincronización offline', status: 'IN_PROGRESS', priority: 'high', assigneeId: 114, teamId: 'team-2-a' },
  { id: 'pt-6', projectId: 2, code: 'US-202', title: 'Push notifications', status: 'TODO', priority: 'medium', assigneeId: 119, teamId: 'team-2-a' },
  { id: 'pt-7', projectId: 2, code: 'US-203', title: 'Suite E2E dispositivos', status: 'TODO', priority: 'high', assigneeId: 120, teamId: 'team-2-b' },
  { id: 'pt-8', projectId: 3, code: 'US-301', title: 'Pipeline ingesta SAP', status: 'BACKLOG', priority: 'high', assigneeId: 110, teamId: 'team-3-a' },
  { id: 'pt-9', projectId: 3, code: 'US-302', title: 'Catálogo Glue Data', status: 'IN_PROGRESS', priority: 'medium', assigneeId: 121, teamId: 'team-3-a' },
  { id: 'pt-10', projectId: 4, code: 'US-401', title: 'Escaneo OWASP CI', status: 'TODO', priority: 'critical', assigneeId: 111, teamId: 'team-4-a' },
  { id: 'pt-11', projectId: 4, code: 'US-402', title: 'Rotación secretos Vault', status: 'DONE', priority: 'high', assigneeId: 117, teamId: 'team-4-a' },
  { id: 'pt-12', projectId: 7, code: 'US-701', title: 'Checkout Transbank', status: 'IN_PROGRESS', priority: 'critical', assigneeId: 106, teamId: 'team-7-a' },
  { id: 'pt-13', projectId: 7, code: 'US-702', title: 'Catálogo productos SEO', status: 'TODO', priority: 'medium', assigneeId: 123, teamId: 'team-7-a' },
  { id: 'pt-14', projectId: 8, code: 'US-801', title: 'Dashboards SLO', status: 'IN_PROGRESS', priority: 'high', assigneeId: 107, teamId: 'team-8-a' },
  { id: 'pt-15', projectId: 10, code: 'US-1001', title: 'OAuth2 partners', status: 'REVIEW', priority: 'high', assigneeId: 109, teamId: 'team-10-a' },
  { id: 'pt-16', projectId: 10, code: 'US-1002', title: 'Rate limiting por tenant', status: 'TODO', priority: 'medium', assigneeId: null, teamId: 'team-10-a' },
  { id: 'pt-17', projectId: 11, code: 'US-1101', title: 'Modelo estrella ventas', status: 'IN_PROGRESS', priority: 'medium', assigneeId: 110, teamId: null },
  { id: 'pt-18', projectId: 12, code: 'US-1201', title: 'Landing zone Terraform', status: 'BACKLOG', priority: 'high', assigneeId: 112, teamId: null }
];

export function getMemberById(id) {
  return MOCK_MEMBERS.find((m) => m.id === id);
}

export function getProjectById(id) {
  return MOCK_PROJECTS.find((p) => p.id === Number(id));
}

export function getLeadName(project) {
  const lead = getMemberById(project?.leadId);
  return lead?.name || '—';
}

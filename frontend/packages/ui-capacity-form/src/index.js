/**
 * Patrón Composite: formulario compuesto por campos validables.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class FormField {
  constructor(name, required = true, type = 'text') {
    this.name = name;
    this.required = required;
    this.type = type;
    this.value = '';
    this.minLength = type === 'text' ? 2 : 0;
  }
  setValue(v) { this.value = v; }
  validate() {
    const trimmed = String(this.value).trim();
    if (this.required && !trimmed) {
      return { valid: false, error: `${this.name} es obligatorio` };
    }
    if (trimmed && this.minLength > 0 && trimmed.length < this.minLength) {
      return { valid: false, error: `${this.name} debe tener al menos ${this.minLength} caracteres` };
    }
    if (this.type === 'email' && trimmed && !EMAIL_RE.test(trimmed)) {
      return { valid: false, error: 'Email inválido' };
    }
    return { valid: true };
  }
}

export class CompositeForm {
  constructor(fields = []) {
    this.fields = fields;
  }
  add(field) {
    this.fields.push(field);
    return this;
  }
  validate() {
    const errors = [];
    for (const field of this.fields) {
      const result = field.validate();
      if (!result.valid) errors.push(result.error);
    }
    return { valid: errors.length === 0, errors };
  }
  toObject() {
    return Object.fromEntries(this.fields.map(f => [f.name, f.value]));
  }
}

export function capacityBadge(percent) {
  const level = percent >= 50 ? 'alta' : percent >= 20 ? 'media' : 'baja';
  return { percent, level, label: `Capacidad ${level}: ${percent.toFixed(0)}%` };
}

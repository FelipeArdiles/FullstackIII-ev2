/**
 * Patrón Composite: formulario compuesto por campos validables.
 */
export class FormField {
  constructor(name, required = true) {
    this.name = name;
    this.required = required;
    this.value = '';
  }
  setValue(v) { this.value = v; }
  validate() {
    if (this.required && !String(this.value).trim()) {
      return { valid: false, error: `${this.name} es obligatorio` };
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

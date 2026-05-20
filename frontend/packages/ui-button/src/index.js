/**
 * Componente NPM: botón con variantes.
 * Patrón: Simple Factory para variantes visuales.
 */
export function createButton({ label, variant = 'primary', onClick, disabled = false }) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.className = `innovatech-btn innovatech-btn--${variant}`;
  btn.disabled = disabled;
  if (onClick) btn.addEventListener('click', onClick);
  return btn;
}

export const variants = ['primary', 'secondary', 'danger'];
export { Button } from './Button.js';

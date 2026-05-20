import { createElement } from 'react';

/**
 * Botón React reutilizable (variantes primary | secondary | danger).
 */
export function Button({
  children,
  label,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = ''
}) {
  const text = children ?? label;
  return createElement(
    'button',
    {
      type,
      className: `innovatech-btn innovatech-btn--${variant} ${className}`.trim(),
      onClick,
      disabled
    },
    text
  );
}

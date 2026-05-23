/**
 * Merge class names (tailwind-safe when used with consistent token order).
 */
export function cn(...inputs) {
  return inputs.flat(Infinity).filter(Boolean).join(' ')
}

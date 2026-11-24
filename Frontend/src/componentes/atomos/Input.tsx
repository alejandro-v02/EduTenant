import type { InputHTMLAttributes } from 'react';

export function Input({ className = '', ...resto }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`campo-entrada ${className}`.trim()} {...resto} />;
}

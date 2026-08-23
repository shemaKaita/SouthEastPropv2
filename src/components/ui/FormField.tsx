"use client";

import type { ReactNode } from "react";
import { labelClassName, errorClassName, inputClassName } from "./formStyles";

export type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  children?: ReactNode;
};

export default function FormField({
  id,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      {children ?? (
        <input
          id={id}
          type={type}
          name={name}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClassName}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
        />
      )}
      {error && (
        <p className={errorClassName} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

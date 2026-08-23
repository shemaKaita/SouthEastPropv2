"use client";

import {
  labelClassName,
  errorClassName,
  selectClassName,
  chevronBg,
} from "./formStyles";

export type FormSelectOption = {
  value: string;
  label: string;
};

export type FormSelectProps = {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<FormSelectOption>;
  required?: boolean;
  placeholder?: string;
  error?: string;
};

export default function FormSelect({
  id,
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder,
  error,
}: FormSelectProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClassName}
        style={{ backgroundImage: chevronBg }}
        aria-invalid={error ? true : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className={errorClassName} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

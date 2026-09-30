import React from 'react';
import { Icon } from '@/components/ui/Icon';

interface FieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  status?: string;
  prefix?: string;
  optional?: boolean;
  right?: React.ReactNode;
}

export function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  hint,
  status,
  prefix,
  optional,
  right,
  ...r
}: FieldProps) {
  const inv = !!error;
  return (
    <div className="mb-6">
      <label htmlFor={id} className="text-sm font-medium flex justify-between mb-2">
        {label}
        {optional && <span className="lbl">Optional</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span
            className="absolute left-3 top-1/2 -translate-y-1/2 text-mut"
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          aria-invalid={inv}
          aria-describedby={id + '-d'}
          className={'inp pr-11 ' + (prefix ? 'pl-8' : '')}
          {...r}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 flex">
          {right ||
            (status === 'ok' ? (
              <Icon n="check" />
            ) : status === 'checking' ? (
              <Icon n="loader" c="w-4 h-4 spin" />
            ) : status === 'taken' || inv ? (
              <Icon n="x" c="w-4 h-4 text-coral" />
            ) : null)}
        </span>
      </div>
      <p
        id={id + '-d'}
        role={inv ? 'alert' : undefined}
        className={'text-xs mt-2 ' + (inv || status === 'ok' ? 'text-fg' : 'text-mut')}
      >
        {inv && (
          <span className="inline-block w-2 h-2 bg-coral mr-2" aria-hidden="true"></span>
        )}
        {error || hint}
      </p>
    </div>
  );
}

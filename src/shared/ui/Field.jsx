import { useId } from 'react';

const controlClass =
  'w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-950 transition-[border-color,box-shadow,background-color] placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-emerald-500 dark:focus:bg-slate-900 dark:focus:ring-emerald-950';

export function Field({
  as: Component = 'input',
  id,
  label,
  hint,
  error,
  required = false,
  className = '',
  wrapperClassName = '',
  children,
  ...props
}) {
  const generatedId = useId();
  const controlId = id || `field-${generatedId.replace(/:/g, '')}`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const describedBy = [props['aria-describedby'], hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={wrapperClassName}>
      {label ? (
        <label htmlFor={controlId} className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
          {label}
          {required ? <span className="ml-1 text-rose-600" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <Component
        id={controlId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${controlClass} ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-100' : ''} ${className}`.trim()}
        {...props}
      >
        {children}
      </Component>
      {hint ? <p id={hintId} className="mt-1.5 text-xs text-slate-500">{hint}</p> : null}
      {error ? <p id={errorId} className="mt-1.5 text-xs font-semibold text-rose-700">{error}</p> : null}
    </div>
  );
}

export default Field;

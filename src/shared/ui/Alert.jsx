import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const styles = {
  success: { container: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: CheckCircle2 },
  error: { container: 'border-rose-200 bg-rose-50 text-rose-800', icon: AlertCircle },
  info: { container: 'border-sky-200 bg-sky-50 text-sky-800', icon: Info },
};

export function Alert({ type = 'info', title, children, className = '' }) {
  const meta = styles[type] || styles.info;
  const Icon = meta.icon;

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm font-semibold ${meta.container} ${className}`.trim()}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        {title ? <p className="font-black">{title}</p> : null}
        {children ? <div className={title ? 'mt-1 font-medium' : ''}>{children}</div> : null}
      </div>
    </div>
  );
}

export default Alert;

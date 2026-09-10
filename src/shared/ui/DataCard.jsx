export function DataCard({ as: Component = 'section', title, description, actions, children, className = '', ...props }) {
  return (
    <Component
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`.trim()}
      {...props}
    >
      {title || description || actions ? (
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="min-w-0">
            {title ? <h2 className="font-display text-lg font-black text-slate-900 dark:text-white">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </Component>
  );
}

export default DataCard;

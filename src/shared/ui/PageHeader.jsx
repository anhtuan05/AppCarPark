export function PageHeader({ title, description, eyebrow, actions, className = '' }) {
  return (
    <header className={`flex flex-col justify-between gap-4 sm:flex-row sm:items-end ${className}`.trim()}>
      <div className="min-w-0">
        {eyebrow ? <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p> : null}
        <h1 className={`${eyebrow ? 'mt-1 ' : ''}text-balance font-display text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white`}>
          {title}
        </h1>
        {description ? <p className="mt-1 text-pretty text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export default PageHeader;

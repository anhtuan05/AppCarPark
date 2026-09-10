import { forwardRef } from 'react';

const baseClass =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-bold transition-[background-color,border-color,color,box-shadow,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variants = {
  primary: 'bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 active:scale-[0.99]',
  secondary: 'border border-slate-300 bg-white text-slate-800 shadow-sm hover:border-emerald-300 hover:bg-emerald-50',
  danger: 'bg-rose-700 text-white shadow-sm hover:bg-rose-800 active:scale-[0.99]',
  ghost: 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
};

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'min-h-12 px-7 py-3 text-base',
  icon: 'h-11 w-11 p-0',
};

export const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    className = '',
    variant = 'primary',
    size = 'md',
    type,
    ...props
  },
  ref,
) {
  const buttonType = Component === 'button' ? (type || 'button') : undefined;

  return (
    <Component
      ref={ref}
      type={buttonType}
      className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`.trim()}
      {...props}
    />
  );
});

export default Button;

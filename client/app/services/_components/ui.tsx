import Link from 'next/link';
import { ArrowLeft, ChevronDown, Landmark } from 'lucide-react';
import { type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';

type ClassName = string | undefined;

export function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

export function Shell({ className, children }: { className?: ClassName; children: ReactNode }) {
  return <div className={cn('mx-auto max-w-6xl px-6 py-10', className)}>{children}</div>;
}

export function BrandLink({ href = '/dashboard', className }: { href?: string; className?: ClassName }) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-3 text-[20px] font-semibold tracking-tight text-slate-900', className)}>
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
        <Landmark size={18} />
      </span>
      <span>
        Civic <span className="text-blue-600">Companion</span>
      </span>
    </Link>
  );
}

export function Navbar({ rightSlot, backHref, backLabel = 'All services' }: { rightSlot?: ReactNode; backHref?: string; backLabel?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
      <Shell className="py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {backHref ? (
              <Link href={backHref} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:text-blue-700 hover:shadow-md">
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
            ) : null}
            <BrandLink className="shrink-0" />
          </div>
          {rightSlot}
        </div>
      </Shell>
    </header>
  );
}

const cardClass = 'rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(cardClass, className)} {...props}>
      {children}
    </div>
  );
}

export function CardLink({ href, className, children }: { href: string; className?: ClassName; children: ReactNode }) {
  return (
    <Link href={href} className={cn('block', cardClass, className)}>
      {children}
    </Link>
  );
}

const buttonClass = {
  primary:
    'inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-70',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-70',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:cursor-not-allowed disabled:opacity-70',
} as const;

export function Button({ variant = 'primary', className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonClass }) {
  return (
    <button className={cn(buttonClass[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ href, variant = 'primary', className, children }: { href: string; variant?: keyof typeof buttonClass; className?: ClassName; children: ReactNode }) {
  return (
    <Link href={href} className={cn(buttonClass[variant], className)}>
      {children}
    </Link>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: ClassName }) {
  return <span className={cn('inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-700', className)}>{children}</span>;
}

export function SectionTitle({ title, description, className }: { title: ReactNode; description?: ReactNode; className?: ClassName }) {
  return (
    <div className={cn('max-w-3xl', className)}>
      <h1 className="font-display text-4xl leading-[1.05] tracking-[-0.04em] text-slate-900 sm:text-5xl">{title}</h1>
      {description ? <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{description}</p> : null}
    </div>
  );
}

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-sm font-semibold text-slate-800">{label}</span>
      {children}
      {hint ? <span className="block text-sm text-slate-500">{hint}</span> : null}
      {error ? <span className="block text-sm font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

const controlClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

export function InputField(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, props.className)} />;
}

export function SelectField({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={cn(controlClass, 'appearance-none pr-12', className)}>
        {children}
      </select>
      <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

export function ProgressStepper({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      {steps.map((step, index) => {
        const active = index <= currentStep;
        return (
          <div key={step} className="flex min-w-0 flex-1 items-center gap-3">
            <div className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-all', active ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/20' : 'border-slate-200 bg-slate-50 text-slate-400')}>
              {index + 1}
            </div>
            <div className={cn('min-w-0', active ? 'text-slate-900' : 'text-slate-400')}>
              <div className="truncate text-sm font-semibold">{step}</div>
              <div className="hidden text-xs text-slate-500 sm:block">{active ? 'In progress' : 'Upcoming'}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
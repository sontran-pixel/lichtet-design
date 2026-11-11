import React, { Component, type ComponentProps, type ReactNode } from 'react';

export const Surface = ({
  inset = false,
  className = '',
  ...props
}: ComponentProps<'div'> & { inset?: boolean }) => (
  <div
    className={`min-w-0 rounded-card text-foreground ${
      inset
        ? 'bg-background border border-border/80'
        : 'bg-surface border border-border shadow-surface'
    } ${className}`}
    {...props}
  />
);

const buttonTones = {
  primary: 'bg-primary text-primary-foreground border border-primary',
  accent: 'bg-accent text-accent-foreground border border-accent',
  quiet: 'bg-surface text-foreground border border-border',
  ghost: 'bg-transparent text-foreground border border-transparent hover:bg-background',
};

export const Button = ({
  tone = 'primary',
  type = 'button',
  size = 'md',
  className = '',
  ...props
}: ComponentProps<'button'> & {
  tone?: keyof typeof buttonTones;
  size?: 'sm' | 'md';
}) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-colors cursor-pointer hover:brightness-95 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-45 disabled:cursor-not-allowed disabled:active:translate-y-0 ${
      size === 'sm' ? 'min-h-9 px-3 text-sm' : 'min-h-11 px-4 text-sm sm:text-base'
    } ${buttonTones[tone]} ${className}`}
    {...props}
  />
);

export const Field = ({
  label,
  hint,
  error,
  htmlFor,
  required,
  children,
  className = '',
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) => (
  <div className={`min-w-0 flex flex-col gap-1.5 ${className}`}>
    <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="ml-1 text-primary" aria-hidden="true">*</span>}
    </label>
    {children}
    {error ? (
      <p role="alert" className="text-xs font-medium text-primary">
        {error}
      </p>
    ) : hint ? (
      <p className="text-xs text-muted">{hint}</p>
    ) : null}
  </div>
);

export const inputClassName =
  'w-full min-h-11 rounded-control border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary disabled:opacity-50';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'Đã xảy ra lỗi không mong muốn khi hiển thị trình thiết kế.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-dvh bg-background flex items-center justify-center p-6">
          <Surface className="max-w-md w-full p-6 space-y-4">
            <h1 className="font-display text-2xl font-semibold text-foreground">
              Không thể hiển thị trang
            </h1>
            <p role="alert" className="text-sm text-muted">
              {this.state.message}
            </p>
            <Button onClick={() => window.location.reload()}>Tải lại ứng dụng</Button>
          </Surface>
        </div>
      );
    }
    return this.props.children;
  }
}

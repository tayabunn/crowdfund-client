import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    let baseStyles = "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";
    let variantStyles = "";
    
    if (variant === 'outline') {
      variantStyles = "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900";
    } else if (variant === 'destructive') {
      variantStyles = "bg-red-600 text-white hover:bg-red-700";
    } else {
      variantStyles = "bg-primary text-white hover:bg-primary-dark";
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

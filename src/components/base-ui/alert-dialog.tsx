import React, { createContext, useContext, useState } from 'react';

const AlertDialogContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function AlertDialog({ open: controlledOpen, onOpenChange, children }: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : localOpen;
  const setOpen = onOpenChange !== undefined ? onOpenChange : setLocalOpen;

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

export function AlertDialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { setOpen } = useContext(AlertDialogContext);
  
  if (React.isValidElement(children)) {
    const element = children as React.ReactElement<any>;
    return React.cloneElement(element, {
      onClick: (e: any) => {
        if (element.props.onClick) element.props.onClick(e);
        setOpen(true);
      }
    });
  }
  return <div onClick={() => setOpen(true)}>{children}</div>;
}

export function AlertDialogContent({ className = '', children }: { className?: string; children: React.ReactNode }) {
  const { open, setOpen } = useContext(AlertDialogContext);
  
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={() => setOpen(false)}
      />
      {/* Dialog container */}
      <div className={`relative z-50 w-full max-w-lg p-6 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-neutral-900 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function AlertDialogHeader({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`}>
      {children}
    </div>
  );
}

export function AlertDialogTitle({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-neutral-100 ${className}`}>
      {children}
    </h3>
  );
}

export function AlertDialogDescription({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`text-sm text-gray-500 dark:text-neutral-300 ${className}`}>
      {children}
    </div>
  );
}

export function AlertDialogFooter({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
      {children}
    </div>
  );
}

export function AlertDialogAction({ className = '', onClick, children, disabled }: {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const { setOpen } = useContext(AlertDialogContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    setOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function AlertDialogCancel({ className = '', onClick, children }: {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  const { setOpen } = useContext(AlertDialogContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }
    setOpen(false);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all ${className}`}
    >
      {children}
    </button>
  );
}

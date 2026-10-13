import { ReactNode } from 'react';

interface PageStatusProps {
  children: ReactNode;
}

/** Loading or error message a page shows instead of its view. */
export function PageStatus({ children }: PageStatusProps) {
  return (
    <p role="status" className="px-10 py-8 text-14 text-muted-foreground">
      {children}
    </p>
  );
}

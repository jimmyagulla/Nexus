import { ReactNode } from 'react';
import { BrandLogo } from '../../../common/layout/BrandLogo';
import { Card } from '../../../shared/card';

interface AuthLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

/** Full-page frame of the sign-in screens: logo, 440px card, optional footer. */
export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-7 bg-background px-4 font-sans text-foreground">
      {/* h-8: the name's line-height is lost to the text-24 merge in BrandLogo. */}
      <BrandLogo size="auth" className="h-8" />
      <Card className="flex w-full max-w-110 flex-col gap-5 p-8">{children}</Card>
      {footer}
    </div>
  );
}

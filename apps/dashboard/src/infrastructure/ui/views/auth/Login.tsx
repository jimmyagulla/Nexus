import { LoginForm } from '../../features/auth/LoginForm';
import { i18n } from '../../i18n/i18n';
import { AuthHeading } from './components/AuthHeading';
import { AuthLayout } from './components/AuthLayout';
import type { LoginViewModel } from '../../../../adapters/presenters/auth/auth.view-models';

interface LoginProps {
  model: LoginViewModel;
}

/** P1.1 — sign-in to the vault, outside the app shell. */
export function Login({ model }: LoginProps) {
  const labels = i18n.messages.auth;

  return (
    <AuthLayout
      footer={
        <span className="text-12 text-subtle">{labels.footerLinks}</span>
      }
    >
      <AuthHeading title={labels.login.title} description={model.organization} />
      <LoginForm email={model.email} password={model.password} />
      <div className="flex gap-2.5 border-t border-border pt-4">
        <i aria-hidden className="ri-lock-2-line text-18 text-green-500" />
        <span className="text-13 leading-4.5 text-muted-foreground">
          {labels.login.securityNote}
        </span>
      </div>
    </AuthLayout>
  );
}

import { Link } from '@tanstack/react-router';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Input } from '../../shared/input';
import { Label } from '../../shared/label';

interface LoginFormProps {
  email: string;
  password: string;
}

/** P1.1 — e-mail and password fields, then the sign-in button. */
export function LoginForm({ email, password }: LoginFormProps) {
  const labels = i18n.messages.auth.login;

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">{labels.email}</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          defaultValue={email}
          className="h-10.5"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <Label htmlFor="login-password">{labels.password}</Label>
          <Button
            type="button"
            variant="link"
            className="h-auto self-start px-0 text-13 hover:no-underline"
          >
            {labels.forgotPassword}
          </Button>
        </div>
        <div className="relative">
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            defaultValue={password}
            className="h-11 border-2 border-ring px-2.75 pr-9 text-16 tracking-widest"
          />
          <button
            type="button"
            aria-label={labels.showPassword}
            className="absolute right-2.75 top-1/2 flex -translate-y-1/2 text-subtle hover:text-primary focus-visible:shadow-focus focus-visible:outline-none"
          >
            <i aria-hidden className="ri-eye-off-line text-18" />
          </button>
        </div>
      </div>
      <Button asChild size="xl">
        <Link to={AppRoutes.loginVerification}>{labels.submit}</Link>
      </Button>
    </>
  );
}

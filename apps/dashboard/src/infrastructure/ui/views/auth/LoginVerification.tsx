import { IconTile } from '../../common/data/IconTile';
import { LoginVerificationForm } from '../../features/auth/LoginVerificationForm';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';
import { AuthHeading } from './components/AuthHeading';
import { AuthLayout } from './components/AuthLayout';
import type { LoginVerificationViewModel } from '../../../../adapters/presenters/auth/login-verification.presenter';

interface LoginVerificationProps {
  model: LoginVerificationViewModel;
}

/** P1.2 — two-step verification code, outside the app shell. */
export function LoginVerification({ model }: LoginVerificationProps) {
  const labels = i18n.messages.auth.verification;

  return (
    <AuthLayout>
      <IconTile tone="blue" size={48}>
        <i aria-hidden className="ri-mail-lock-line text-24" />
      </IconTile>
      <AuthHeading
        title={labels.title}
        description={
          <>
            {`${labels.codeSentPrefix} `}
            <b className="text-foreground">{model.maskedEmail}</b>
            {labels.codeSentSuffix}
          </>
        }
      />
      <LoginVerificationForm code={model.code} />
      <div className="flex justify-between text-13">
        <span className="text-muted-foreground">{labels.codeNotReceived}</span>
        <Button
          type="button"
          variant="link"
          className="h-auto px-0 text-13 hover:no-underline"
        >
          {`${labels.resend} (${model.resendIn})`}
        </Button>
      </div>
    </AuthLayout>
  );
}

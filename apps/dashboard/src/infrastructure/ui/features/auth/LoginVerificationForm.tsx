import { Link } from '@tanstack/react-router';
import { i18n } from '../../i18n/i18n';
import { AppRoutes } from '../../routes/app-routes';
import { Button } from '../../shared/button';
import { Checkbox } from '../../shared/checkbox';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../../shared/input-otp';
import { Label } from '../../shared/label';

interface LoginVerificationFormProps {
  code: string;
}

const CODE_LENGTH = 6;
const slotIndexes = Array.from({ length: CODE_LENGTH }, (_, index) => index);

/** P1.2 — 6-digit code, trusted device option, then the verify button. */
export function LoginVerificationForm({ code }: LoginVerificationFormProps) {
  const labels = i18n.messages.auth.verification;

  return (
    <>
      <InputOTP
        maxLength={CODE_LENGTH}
        defaultValue={code}
        aria-label={labels.code}
        autoFocus
        containerClassName="w-full"
      >
        <InputOTPGroup className="grid w-full grid-cols-6 items-start gap-2">
          {slotIndexes.map((index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="box-content h-13 w-auto rounded-sm text-22 text-foreground shadow-none"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <div className="flex items-center gap-2">
        <Checkbox id="trust-device" defaultChecked />
        <Label htmlFor="trust-device" className="font-normal">
          {labels.trustDevice}
        </Label>
      </div>
      <Button asChild size="xl">
        <Link to={AppRoutes.home}>{labels.submit}</Link>
      </Button>
    </>
  );
}

import { i18n } from '../../i18n/i18n';

export function SecureConnectionChip() {
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-green-25 px-2.5 text-12 font-semibold text-green-700">
      <i aria-hidden className="ri-lock-2-line text-14" />
      {i18n.messages.shell.secureConnection}
    </span>
  );
}

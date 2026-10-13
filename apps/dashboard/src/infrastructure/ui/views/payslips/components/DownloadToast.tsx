import { i18n } from '../../../i18n/i18n';

/** Static dark toast confirming the payslip download, bottom-right of the screen. */
export function DownloadToast({ fileName }: { fileName: string }) {
  return (
    <div
      role="status"
      className="absolute bottom-6 right-6 flex items-center gap-3 rounded-lg bg-ink-800 px-4 py-3 text-14 text-white shadow-popover-strong"
    >
      <i aria-hidden className="ri-checkbox-circle-fill text-20 text-green-300" />
      {`${i18n.messages.payslips.detail.downloadDone} · ${fileName}`}
    </div>
  );
}

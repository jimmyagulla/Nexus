import { i18n } from '../../../i18n/i18n';

interface SubmittedBannerProps {
  title: string;
  description: string;
}

/** Green success banner shown once a note is submitted. */
export function SubmittedBanner({ title, description }: SubmittedBannerProps) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-25 px-4 py-3.5"
    >
      <i aria-hidden className="ri-checkbox-circle-fill text-22 text-green-500" />
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-14 font-bold text-green-900">{title}</span>
        <span className="text-13 text-green-700">{description}</span>
      </div>
      <button
        type="button"
        aria-label={i18n.messages.expenseReports.submitted.dismiss}
        className="flex text-green-700 focus-visible:outline-none focus-visible:shadow-focus"
      >
        <i aria-hidden className="ri-close-line text-20" />
      </button>
    </div>
  );
}

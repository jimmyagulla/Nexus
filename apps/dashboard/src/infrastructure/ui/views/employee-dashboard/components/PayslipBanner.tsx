import { Link, type LinkOptions } from '@tanstack/react-router';

export interface PayslipBannerModel {
  title: string;
  subtitle: string;
  link: LinkOptions;
}

/** Blue banner of the latest payslip on the mobile home (M.1). */
export function PayslipBanner({ banner }: { banner: PayslipBannerModel }) {
  return (
    <Link
      {...banner.link}
      className="flex items-center gap-3 rounded-lg bg-primary p-3.5 text-white outline-none focus-visible:shadow-focus"
    >
      <i aria-hidden className="ri-file-paper-2-line text-22" />
      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-15 font-bold">{banner.title}</span>
        <span className="text-12 text-blue-200">{banner.subtitle}</span>
      </div>
      <i aria-hidden className="ri-arrow-right-line text-20" />
    </Link>
  );
}

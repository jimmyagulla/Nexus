/** What the payslips screen lets the person do. */
export interface PayslipsListHandlers {
  onChooseYear: (year: number) => void;
  onView: (payslipId: string) => void;
  onDownload: (payslipId: string) => void;
  /** Saves every payslip of the year shown in one archive. */
  onDownloadAll: () => void;
}

interface MobileFilePickerProps {
  /** Remix Icon class, e.g. `ri-camera-line`. */
  icon: string;
  label: string;
  /** Opens the camera instead of the file browser. */
  capture?: boolean;
}

/** Dashed 72px tile opening the camera or the file browser. */
export function MobileFilePicker({ icon, label, capture }: MobileFilePickerProps) {
  return (
    <label className="box-content flex h-18 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-disabled bg-blue-25 text-13 font-semibold text-primary transition-colors hover:border-primary">
      <i aria-hidden className={`${icon} text-22`} />
      {label}
      <input
        type="file"
        accept={capture ? 'image/*' : undefined}
        capture={capture ? 'environment' : undefined}
        className="sr-only"
      />
    </label>
  );
}

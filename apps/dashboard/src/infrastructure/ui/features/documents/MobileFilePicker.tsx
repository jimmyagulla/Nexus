interface MobileFilePickerProps {
  /** Remix Icon class, e.g. `ri-camera-line`. */
  icon: string;
  label: string;
  /** Opens the camera instead of the file browser. */
  capture?: boolean;
  /** `accept` of the file browser; the camera always takes images. */
  accept?: string;
  onFiles?: (files: File[]) => void;
}

/** Dashed 72px tile opening the camera or the file browser. */
export function MobileFilePicker({ icon, label, capture, accept, onFiles }: MobileFilePickerProps) {
  return (
    <label className="box-content flex h-18 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-disabled bg-blue-25 text-13 font-semibold text-primary transition-colors hover:border-primary focus-within:shadow-focus">
      <i aria-hidden className={`${icon} text-22`} />
      {label}
      <input
        type="file"
        accept={capture ? 'image/jpeg,image/png' : accept}
        capture={capture ? 'environment' : undefined}
        multiple={!capture}
        onChange={(event) => {
          onFiles?.(Array.from(event.target.files ?? []));
          event.target.value = '';
        }}
        className="sr-only"
      />
    </label>
  );
}

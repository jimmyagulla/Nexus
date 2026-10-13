interface MobileUploadedFileProps {
  name: string;
  details: string;
}

/** Imported file row of the mobile upload form (no remove action). */
export function MobileUploadedFile({ name, details }: MobileUploadedFileProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5">
      <i aria-hidden className="ri-image-line text-20 text-primary" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-14 font-semibold">{name}</span>
        <span className="text-12 text-subtle">{details}</span>
      </div>
      <i aria-hidden className="ri-checkbox-circle-fill text-20 text-green-500" />
    </div>
  );
}

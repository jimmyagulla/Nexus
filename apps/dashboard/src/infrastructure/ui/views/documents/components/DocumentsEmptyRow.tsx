interface DocumentsEmptyRowProps {
  message: string;
}

/** Single line of the table when it holds no document. */
export function DocumentsEmptyRow({ message }: DocumentsEmptyRowProps) {
  return (
    <div role="row" className="px-4 py-6 text-center text-14 text-muted-foreground">
      <span role="cell">{message}</span>
    </div>
  );
}

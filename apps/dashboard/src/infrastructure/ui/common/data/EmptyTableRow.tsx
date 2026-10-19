interface EmptyTableRowProps {
  message: string;
}

/** Single line of a table when it holds no row. */
export function EmptyTableRow({ message }: EmptyTableRowProps) {
  return (
    <div role="row" className="px-4 py-6 text-center text-14 text-muted-foreground">
      <span role="cell">{message}</span>
    </div>
  );
}

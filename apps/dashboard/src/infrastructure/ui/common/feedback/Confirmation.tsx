interface ConfirmationProps {
  message: string | null;
}

export function Confirmation({ message }: ConfirmationProps) {
  if (message === null) {
    return null;
  }

  return (
    <p role="status" className="text-sm font-medium text-success">
      {message}
    </p>
  );
}

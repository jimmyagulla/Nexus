interface SubmissionErrorProps {
  message: string | null;
}

export function SubmissionError({ message }: SubmissionErrorProps) {
  if (message === null) {
    return null;
  }

  return (
    <p role="alert" className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

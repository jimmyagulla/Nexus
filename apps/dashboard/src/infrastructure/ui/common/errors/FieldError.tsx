interface FieldErrorProps {
  /** Translated message; nothing is shown when null. */
  message: string | null;
}

/** Refusal shown under a form field; the refusal of a whole form is SubmissionError. */
export function FieldError({ message }: FieldErrorProps) {
  return message === null ? null : (
    <p role="alert" className="text-12 text-destructive">
      {message}
    </p>
  );
}

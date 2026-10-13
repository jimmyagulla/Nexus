import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorPresenter } from '../../../../../adapters/presenters/error.presenter';
import { SubmissionError } from '../../../common/errors/SubmissionError';
import { Button } from '../../../shared/button';
import { Input } from '../../../shared/input';
import { i18n } from '../../../i18n/i18n';
import { receiptSchema, type ReceiptValues } from './receipt.schema';

interface ReceiptFormProps {
  errorPresenter: ErrorPresenter;
  submissionError: string | null;
  onSubmit: (values: ReceiptValues) => Promise<boolean>;
}

export function ReceiptForm({
  errorPresenter,
  submissionError,
  onSubmit,
}: ReceiptFormProps) {
  const form = useForm<ReceiptValues>({
    resolver: zodResolver(receiptSchema),
  });
  const [inputKey, setInputKey] = useState(0);
  const fileError = form.formState.errors.file;

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit(async (values) => {
        if (await onSubmit(values)) {
          form.reset();
          setInputKey((key) => key + 1);
        }
      })}
    >
      <div>
        <label className="block text-sm" htmlFor="receipt-file">
          {i18n.messages.expenseReports.receiptFile}
        </label>
        <Input
          key={inputKey}
          id="receipt-file"
          type="file"
          accept="application/pdf,image/jpeg,image/png"
          onChange={(event) =>
            form.setValue('file', event.target.files?.[0] as File)
          }
        />
        {fileError ? <p>{errorPresenter.present(fileError.message)}</p> : null}
      </div>
      <SubmissionError message={submissionError} />
      <Button type="submit">{i18n.messages.expenseReports.attachReceipt}</Button>
    </form>
  );
}

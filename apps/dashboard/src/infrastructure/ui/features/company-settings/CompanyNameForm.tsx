import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '../../shared/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../shared/form';
import { Input } from '../../shared/input';
import { companyNameSchema, CompanyNameValues } from './company-name.schema';

export function CompanyNameForm({
  defaultName,
  submitLabel,
  onSubmit,
}: {
  defaultName: string;
  submitLabel: string;
  onSubmit: (values: CompanyNameValues) => void;
}) {
  const form = useForm<CompanyNameValues>({
    resolver: zodResolver(companyNameSchema),
    values: { name: defaultName },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;entreprise</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{submitLabel}</Button>
      </form>
    </Form>
  );
}

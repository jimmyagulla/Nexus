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
import { holidaySchema, HolidayValues } from './holiday.schema';

export function HolidayForm({
  onSubmit,
}: {
  onSubmit: (values: HolidayValues) => void;
}) {
  const form = useForm<HolidayValues>({
    resolver: zodResolver(holidaySchema),
    defaultValues: { date: '', label: '' },
  });

  return (
    <Form {...form}>
      <form
        className="grid gap-4 md:grid-cols-3"
        onSubmit={form.handleSubmit((values) => {
          onSubmit(values);
          form.reset({ date: '', label: '' });
        })}
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Libellé</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end">
          <Button type="submit">Ajouter</Button>
        </div>
      </form>
    </Form>
  );
}

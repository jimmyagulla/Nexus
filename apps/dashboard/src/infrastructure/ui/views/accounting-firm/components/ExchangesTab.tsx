import { TabsTrigger } from '../../../shared/tabs';

interface ExchangesTabProps {
  value: string;
  label: string;
  count: string;
}

/** Tab of the exchanges list with its document count. */
export function ExchangesTab({ value, label, count }: ExchangesTabProps) {
  return (
    <TabsTrigger value={value} className="h-10 gap-2">
      <span>{label}</span>
      <span className="text-12 font-semibold text-subtle">{count}</span>
    </TabsTrigger>
  );
}

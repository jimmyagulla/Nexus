import { RecoveryCodeItem } from './RecoveryCodeItem';

interface RecoveryCodeListProps {
  codes: string[];
}

export function RecoveryCodeList({ codes }: RecoveryCodeListProps) {
  return (
    <ul className="grid grid-cols-2 gap-2">
      {codes.map((code) => (
        <RecoveryCodeItem key={code} code={code} />
      ))}
    </ul>
  );
}

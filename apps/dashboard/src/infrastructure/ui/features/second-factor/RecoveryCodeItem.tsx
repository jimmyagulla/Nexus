interface RecoveryCodeItemProps {
  code: string;
}

export function RecoveryCodeItem({ code }: RecoveryCodeItemProps) {
  return (
    <li>
      <code>{code}</code>
    </li>
  );
}

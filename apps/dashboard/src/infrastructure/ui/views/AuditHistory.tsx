export function AuditHistory({ lines }: { lines: string[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-medium">Historique</h2>
      <ul className="space-y-2">
        {lines.map((line, index) => (
          <li key={`${index}-${line}`}>{line}</li>
        ))}
      </ul>
    </section>
  );
}

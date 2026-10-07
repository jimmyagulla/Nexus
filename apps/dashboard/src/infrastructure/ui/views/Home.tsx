import { i18n } from '../i18n/i18n';

export function Home() {
  return (
    <h1 className="text-2xl font-semibold text-primary">{i18n.messages.home.title}</h1>
  );
}

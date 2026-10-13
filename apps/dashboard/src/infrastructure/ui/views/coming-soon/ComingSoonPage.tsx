import { ComingSoon } from './ComingSoon';

interface ComingSoonPageProps {
  title: string;
  backTo: string;
}

export function ComingSoonPage({ title, backTo }: ComingSoonPageProps) {
  return <ComingSoon title={title} backTo={backTo} />;
}

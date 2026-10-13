import { ReactNode } from 'react';

interface AuthHeadingProps {
  title: string;
  description: ReactNode;
}

/** 22/28 title and 14/20 description at the top of a sign-in card. */
export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-22 font-bold leading-7 text-heading">{title}</h1>
      <p className="text-pretty text-14 leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

import { ReactNode } from 'react';
import { i18n } from '../../i18n/i18n';
import { Button } from '../../shared/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ModalBody,
} from '../../shared/dialog';

interface PersonalInfoEditProps {
  /** The edition form, shown in the body. */
  children: ReactNode;
  /** Id of that form: the footer's "Enregistrer" sends it from outside. */
  formId: string;
}

/** P3.2 — edit the contact details, in a modal: header, body, footer. */
export function PersonalInfoEdit({ children, formId }: PersonalInfoEditProps) {
  const labels = i18n.messages.personalInfo.edit;

  return (
    <>
      <DialogHeader className="items-start">
        <div className="flex min-w-0 flex-col gap-1.5">
          <DialogTitle className="text-24 font-bold leading-8 text-heading">
            {labels.title}
          </DialogTitle>
          <DialogDescription className="text-14 text-muted-foreground">
            {labels.description}
          </DialogDescription>
        </div>
      </DialogHeader>
      <ModalBody>{children}</ModalBody>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">
            {i18n.messages.common.cancel}
          </Button>
        </DialogClose>
        <Button type="submit" form={formId} className="px-5">
          {labels.save}
        </Button>
      </DialogFooter>
    </>
  );
}

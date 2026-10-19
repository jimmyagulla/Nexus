import { useQuery } from '@tanstack/react-query';
import type { PersonalContactValues } from '@hexagonal-monorepo-template/domain';
import type { ContactFieldModel } from '../../../../adapters/presenters/personal-info/contact-fields.presenter';
import type { EditableInfoModel } from '../../../../adapters/presenters/personal-info/editable-info.presenter';
import type { EmployerInfoModel } from '../../../../adapters/presenters/personal-info/employer-info.presenter';
import type { PersonalInfoLastUpdateModel } from '../../../../adapters/presenters/personal-info/personal-info-last-update.presenter';
import type { PersonalInfoPageComposition } from '../../../composition/personal-info/personal-info-page.composition';

/** What the personal information screen shows: the output of each of its presenters. */
export interface PersonalInfoModels {
  lastUpdate: PersonalInfoLastUpdateModel;
  contact: EditableInfoModel[];
  employer: EmployerInfoModel[];
  /** Fields of the edition modal. */
  fields: ContactFieldModel[];
  /** The saved contact details, which the recap compares the edited ones with. */
  savedContact: PersonalContactValues;
}

export const getPersonalInfoQueryKey = () => ['personal-info'];

export function useGetPersonalInfo({
  controller,
  viewPresenters,
  editPresenters,
}: PersonalInfoPageComposition) {
  return useQuery({
    queryKey: getPersonalInfoQueryKey(),
    queryFn: () => controller.loadPersonalInfo(),
    select: (info): PersonalInfoModels => ({
      lastUpdate: viewPresenters.lastUpdate.present(info),
      contact: viewPresenters.contact.present(info.contact),
      employer: viewPresenters.employer.present(info.employment),
      fields: editPresenters.fields.present(info.contact),
      savedContact: info.contact,
    }),
  });
}

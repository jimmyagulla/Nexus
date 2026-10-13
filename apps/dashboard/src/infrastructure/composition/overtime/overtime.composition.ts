import {
  createOvertimePageComposition,
  type OvertimePageComposition,
} from './overtime-page.composition';
import {
  createOvertimeDeclarationPageComposition,
  type OvertimeDeclarationPageComposition,
} from './overtime-declaration-page.composition';

/** Compositions of the overtime pages. */
export type OvertimeComposition = {
  overtime: OvertimePageComposition;
  overtimeDeclaration: OvertimeDeclarationPageComposition;
};

export function createOvertimeComposition(): OvertimeComposition {
  return {
    overtime: createOvertimePageComposition(),
    overtimeDeclaration: createOvertimeDeclarationPageComposition(),
  };
}

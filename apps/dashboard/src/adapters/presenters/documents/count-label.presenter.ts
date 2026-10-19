/** Wordings of a count: one, several (`{count}`), and optionally none. */
export interface CountForms {
  one: string;
  other: string;
  none?: string;
}

/** "2 filtres appliqués", "Afficher 1 résultat". */
export type CountLabel = string;

/** Picks the wording that matches a count and fills it in. */
export class CountLabelPresenter {
  present(count: number, forms: CountForms): CountLabel {
    if (count === 0 && forms.none !== undefined) {
      return forms.none;
    }
    return (count === 1 ? forms.one : forms.other).replace('{count}', String(count));
  }
}

/**
 * Display vocabulary shared by every view model. Presenters speak in these
 * terms; the UI maps them to its components (Badge tones, IconTile tones,
 * StepProgress, Link).
 */

/** Meaning of a status pill. */
export type StatusTone =
  | 'info'
  | 'submitted'
  | 'neutral'
  | 'draft'
  | 'warning'
  | 'success'
  | 'done'
  | 'danger'
  | 'alert'
  | 'purple'
  | 'brand'
  | 'dark';

export interface StatusViewModel {
  label: string;
  tone: StatusTone;
}

/** Colour code of a flow (documents, leaves, time, expenses…). */
export type FlowTone =
  | 'blue'
  | 'primary'
  | 'green'
  | 'purple'
  | 'amber'
  | 'orange'
  | 'dark'
  | 'translucent'
  | 'neutral';

export type ProgressStepState = 'done' | 'current' | 'upcoming';

export interface ProgressStepViewModel {
  label: string;
  state: ProgressStepState;
}

/** Destination of a link: an app route path and its parameters. */
export interface NavigationTarget {
  to: string;
  params?: Record<string, string>;
}

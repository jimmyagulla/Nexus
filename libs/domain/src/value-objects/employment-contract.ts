/** Kind of employment contract, as the employer records it. */
export const EmploymentContractType = {
  PERMANENT: 'PERMANENT',
  FIXED_TERM: 'FIXED_TERM',
  APPRENTICESHIP: 'APPRENTICESHIP',
  PROFESSIONALISATION: 'PROFESSIONALISATION',
  INTERNSHIP: 'INTERNSHIP',
} as const;

export type EmploymentContractType =
  (typeof EmploymentContractType)[keyof typeof EmploymentContractType];

/** Full time or part time. */
export const WorkingTime = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
} as const;

export type WorkingTime = (typeof WorkingTime)[keyof typeof WorkingTime];

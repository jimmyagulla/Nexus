export const personalInfo = {
  fields: {
    address: 'Address',
    postalCodeAndCity: 'Postal code and city',
    phone: 'Phone',
    email: 'Personal e-mail address',
  },
  employment: {
    lastName: 'Last name',
    firstName: 'First name',
    birthDate: 'Date of birth',
    socialSecurityNumber: 'Social security number',
    jobTitle: 'Position',
    department: 'Department',
    contract: 'Contract type',
    startDate: 'Start date',
    iban: 'Bank details',
    contractValue: '{contract} — {workingTime}',
    contractTypes: {
      PERMANENT: 'Permanent contract',
      FIXED_TERM: 'Fixed-term contract',
      APPRENTICESHIP: 'Apprenticeship',
      PROFESSIONALISATION: 'Work-study contract',
      INTERNSHIP: 'Internship',
    },
    workingTimes: {
      FULL_TIME: 'full time',
      PART_TIME: 'part time',
    },
  },
  view: {
    title: 'My information',
    editableTitle: 'Information you can edit',
    editableDescription: 'Personal contact details',
    edit: 'Edit',
    employerTitle: 'Information managed by the employer',
    employerDescription: 'For any correction, contact the HR department.',
    reportError: 'Report an error to HR',
    lastUpdate: 'Last updated on {date}',
  },
  edit: {
    title: 'Edit my contact details',
    description:
      'Changed fields are highlighted in blue. The HR department is notified of every change.',
    bankNote:
      'Your bank details are managed by the employer. To change them, send a bank statement (RIB) to the HR department.',
    save: 'Save',
  },
  confirm: {
    title: 'Confirm the change',
    description: 'Check the information before saving it.',
    back: 'Go back',
    confirm: 'Confirm',
    emailNotice:
      'A confirmation e-mail will be sent to {email} and the HR department will be notified.',
  },
  updated: {
    title: 'Your contact details have been updated.',
  },
} as const;

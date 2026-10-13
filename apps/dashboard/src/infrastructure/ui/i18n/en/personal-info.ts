export const personalInfo = {
  view: {
    title: 'My information',
    editableTitle: 'Information you can edit',
    editableDescription: 'Personal contact details',
    edit: 'Edit',
    employerTitle: 'Information managed by the employer',
    employerDescription: 'For any correction, contact the HR department.',
    reportError: 'Report an error to HR',
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
  },
  updated: {
    title: 'Your contact details have been updated.',
    modified: 'Changed',
    dismiss: 'Dismiss the message',
  },
} as const;

export type SecondFactorEnrollment = {
  secret: string;
  provisioningUri: string;
};

export type SecondFactorEnrollmentConfirmation = {
  enrolled: true;
};

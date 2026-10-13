export type SecondFactorEnrollment = {
  secret: string;
  provisioningUri: string;
};

export type SecondFactorEnrollmentConfirmation = {
  enrolled: true;
  recoveryCodes: readonly string[];
};

export type SecondFactorVerification = {
  verified: true;
};

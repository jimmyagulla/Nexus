export const auth = {
  footerLinks: 'Legal notice · Privacy · Help',
  login: {
    title: 'Sign in to your vault',
    email: 'Email address',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    showPassword: 'Show password',
    submit: 'Sign in',
    securityNote:
      'Encrypted connection. Your documents are only accessible to authorised people.',
  },
  verification: {
    title: 'Two-step verification',
    codeSentPrefix: 'A 6-digit code has been sent to',
    codeSentSuffix: '. It expires in 10 minutes.',
    code: 'Verification code',
    trustDevice: 'Trust this device for 30 days',
    submit: 'Verify',
    codeNotReceived: "Didn't get the code?",
    resend: 'Resend the code',
  },
} as const;

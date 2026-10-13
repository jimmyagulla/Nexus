export function toOtpAuthUri(input: {
  issuer: string;
  accountName: string;
  secret: string;
}): string {
  const issuer = encodeURIComponent(input.issuer);
  const accountName = encodeURIComponent(input.accountName);
  return `otpauth://totp/${issuer}:${accountName}?secret=${input.secret}&issuer=${issuer}`;
}

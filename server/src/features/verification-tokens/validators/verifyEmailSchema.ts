import z from "zod";

export const verificationTokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type VerificationTokenInput = z.infer<typeof verificationTokenSchema>;

export const resendEmailVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ResendEmailVerificationInput = z.infer<
  typeof resendEmailVerificationSchema
>;

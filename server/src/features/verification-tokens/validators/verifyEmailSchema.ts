import z from "zod";

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const resendEmailVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ResendEmailVerificationInput = z.infer<
  typeof resendEmailVerificationSchema
>;

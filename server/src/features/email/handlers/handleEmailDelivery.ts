import { EmailDeliveryModel } from "@/features/emailDelivery/models/emailDelivery.model";
import { sendAccountVerificationEmail } from "@/features/email/services/sendAccountVerificationEmail.service";
import { UnrecoverableError } from "bullmq";
import { decryptEmailPayload } from "@/features/emailDelivery/services/decryptEmailPayload";
import { sendEmailChangeVerificationEmail } from "@/features/email/services/sendEmailChangeVerificationEmail.service";
import { sendPasswordChangeVerificationEmail } from "@/features/email/services/sendPasswordChangeVerificationEmail.service";

export const handleEmailDelivery = async (deliveryId: string) => {
  const delivery = await EmailDeliveryModel.findOneAndUpdate(
    {
      _id: deliveryId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        status: "processing",
        processingStartedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );

  if (!delivery) {
    return;
  }

  try {
    const rawToken = decryptEmailPayload(delivery.encryptedPayload);

    switch (delivery.type) {
      case "account-verification":
        await sendAccountVerificationEmail({
          to: delivery.email,
          verificationUrl: `${process.env.CLIENT_URL}/verify-email/${rawToken}`,
        });

        break;

      case "email_change":
        await sendEmailChangeVerificationEmail({
          to: delivery.email,
          newEmail: delivery.email,
          verificationUrl: `${process.env.CLIENT_URL}/confirm-email-change/${rawToken}`,
        });

        break;

      case "password_change":
        await sendPasswordChangeVerificationEmail({
          to: delivery.email,
          verificationUrl: `${process.env.CLIENT_URL}/confirm-password-change/${rawToken}`,
        });

        break;

      default:
        throw new UnrecoverableError(
          `Unsupported email delivery type: ${delivery.type}`,
        );
    }

    delivery.status = "sent";
    delivery.processingStartedAt = null;

    await delivery.save();
  } catch (error) {
    delivery.status = "pending";
    delivery.processingStartedAt = null;

    await delivery.save();

    throw error;
  }
};

import { encryptEmailPayload } from "@/features/emailDelivery/services/encryptEmailPayload";
import { EmailDeliveryModel } from "@/features/emailDelivery/models/emailDelivery.model";
import { ClientSession, Types } from "mongoose";
import { EmailDeliveryType } from "@/features/emailDelivery/types/emailDelivery.document";

type CreateEmailDeliveryInput = {
  userId: Types.ObjectId;
  email: string;
  rawToken: string;
  type: EmailDeliveryType;
};

export const createEmailDelivery = async (
  input: CreateEmailDeliveryInput,
  session?: ClientSession,
) => {
  const encryptedPayload = encryptEmailPayload(input.rawToken);

  const delivery = new EmailDeliveryModel({
    userId: input.userId,
    email: input.email,
    encryptedPayload,
    status: "pending",
    type: input.type,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  await delivery.save({ session });

  return delivery;
};

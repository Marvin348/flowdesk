import { EmailDeliveryModel } from "@/features/emailDelivery/models/emailDelivery.model";
import { emailQueue } from "@/queues/emailQueue";

export const recoverPendingEmailDeliveries = async () => {
  const deliveries = await EmailDeliveryModel.find({
    status: "pending",
    queuedAt: null,
    expiresAt: { $gt: new Date() },
  });

  for (const delivery of deliveries) {
    await emailQueue.add(
      "email-delivery",
      {
        deliveryId: delivery._id.toString(),
      },
      {
        jobId: `email-${delivery._id.toString()}`,
      },
    );

    delivery.queuedAt = new Date();
    await delivery.save();
  }
};

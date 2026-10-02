import { handleEmailDelivery } from "@/features/email/handlers/handleEmailDelivery";
import { sendAccountVerificationEmail } from "@/features/email/services/sendAccountVerificationEmail.service";
import { sendEmailChangeVerificationEmail } from "@/features/email/services/sendEmailChangeVerificationEmail.service";
import { sendPasswordChangeVerificationEmail } from "@/features/email/services/sendPasswordChangeVerificationEmail.service";
import { EmailDeliveryModel } from "@/features/emailDelivery/models/emailDelivery.model";
import { encryptEmailPayload } from "@/features/emailDelivery/services/encryptEmailPayload";
import {
  EMAIL_DELIVERY_STATUS,
  type EmailDeliveryType,
} from "@/features/emailDelivery/types/emailDelivery.document";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { Types } from "mongoose";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

type EmailDeliveryStatus = (typeof EMAIL_DELIVERY_STATUS)[number];

vi.mock("@/features/email/services/sendAccountVerificationEmail.service", () => ({
  sendAccountVerificationEmail: vi.fn(),
}));

vi.mock("@/features/email/services/sendEmailChangeVerificationEmail.service", () => ({
  sendEmailChangeVerificationEmail: vi.fn(),
}));

vi.mock(
  "@/features/email/services/sendPasswordChangeVerificationEmail.service",
  () => ({
    sendPasswordChangeVerificationEmail: vi.fn(),
  }),
);

const createDelivery = async ({
  type = "account-verification",
  status = "pending",
  rawToken = "raw-test-token",
  email = "test@example.com",
  expiresAt = new Date(Date.now() + 15 * 60 * 1000),
}: {
  type?: EmailDeliveryType;
  status?: EmailDeliveryStatus;
  rawToken?: string;
  email?: string;
  expiresAt?: Date;
} = {}) =>
  EmailDeliveryModel.create({
    userId: new Types.ObjectId(),
    email,
    encryptedPayload: encryptEmailPayload(rawToken),
    type,
    status,
    processingStartedAt: status === "processing" ? new Date() : null,
    queuedAt: new Date(),
    expiresAt,
  });

const expectNoEmailSent = () => {
  expect(sendAccountVerificationEmail).not.toHaveBeenCalled();
  expect(sendEmailChangeVerificationEmail).not.toHaveBeenCalled();
  expect(sendPasswordChangeVerificationEmail).not.toHaveBeenCalled();
};

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
  vi.clearAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("handleEmailDelivery", () => {
  it("sends an account verification email and marks the delivery as sent", async () => {
    const delivery = await createDelivery();

    vi.mocked(sendAccountVerificationEmail).mockImplementationOnce(async () => {
      const processingDelivery = await EmailDeliveryModel.findById(delivery._id);

      expect(processingDelivery?.status).toBe("processing");
      expect(processingDelivery?.processingStartedAt).toBeInstanceOf(Date);
    });

    await handleEmailDelivery(delivery._id.toString());

    expect(sendAccountVerificationEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      verificationUrl:
        "http://localhost:5173/verify-email/raw-test-token",
    });
    expect(sendEmailChangeVerificationEmail).not.toHaveBeenCalled();
    expect(sendPasswordChangeVerificationEmail).not.toHaveBeenCalled();

    const sentDelivery = await EmailDeliveryModel.findById(delivery._id);

    expect(sentDelivery?.status).toBe("sent");
    expect(sentDelivery?.processingStartedAt).toBeNull();
  });

  it("sends an email change verification email", async () => {
    const delivery = await createDelivery({
      type: "email_change",
      email: "new@example.com",
    });

    await handleEmailDelivery(delivery._id.toString());

    expect(sendEmailChangeVerificationEmail).toHaveBeenCalledWith({
      to: "new@example.com",
      newEmail: "new@example.com",
      verificationUrl:
        "http://localhost:5173/confirm-email-change/raw-test-token",
    });
    expect(sendAccountVerificationEmail).not.toHaveBeenCalled();
    expect(sendPasswordChangeVerificationEmail).not.toHaveBeenCalled();

    expect((await EmailDeliveryModel.findById(delivery._id))?.status).toBe(
      "sent",
    );
  });

  it("sends a password change verification email", async () => {
    const delivery = await createDelivery({ type: "password_change" });

    await handleEmailDelivery(delivery._id.toString());

    expect(sendPasswordChangeVerificationEmail).toHaveBeenCalledWith({
      to: "test@example.com",
      verificationUrl:
        "http://localhost:5173/confirm-password-change/raw-test-token",
    });
    expect(sendAccountVerificationEmail).not.toHaveBeenCalled();
    expect(sendEmailChangeVerificationEmail).not.toHaveBeenCalled();

    expect((await EmailDeliveryModel.findById(delivery._id))?.status).toBe(
      "sent",
    );
  });

  it("returns without sending when the delivery does not exist", async () => {
    await expect(
      handleEmailDelivery(new Types.ObjectId().toString()),
    ).resolves.toBeUndefined();

    expectNoEmailSent();
  });

  it("does not claim or send an expired delivery", async () => {
    const delivery = await createDelivery({
      expiresAt: new Date(Date.now() - 1000),
    });

    await handleEmailDelivery(delivery._id.toString());

    expectNoEmailSent();

    const unchangedDelivery = await EmailDeliveryModel.findById(delivery._id);

    expect(unchangedDelivery?.status).toBe("pending");
    expect(unchangedDelivery?.processingStartedAt).toBeNull();
  });

  it.each<EmailDeliveryStatus>(["processing", "sent", "cancelled"])(
    "does not send a delivery with status %s",
    async (status) => {
      const delivery = await createDelivery({ status });

      await handleEmailDelivery(delivery._id.toString());

      expectNoEmailSent();
      expect((await EmailDeliveryModel.findById(delivery._id))?.status).toBe(
        status,
      );
    },
  );

  it("returns the delivery to pending when sending fails", async () => {
    const delivery = await createDelivery();
    const providerError = new Error("Email provider unavailable");

    vi.mocked(sendAccountVerificationEmail).mockRejectedValueOnce(
      providerError,
    );

    await expect(
      handleEmailDelivery(delivery._id.toString()),
    ).rejects.toThrow(providerError);

    const retriableDelivery = await EmailDeliveryModel.findById(delivery._id);

    expect(retriableDelivery?.status).toBe("pending");
    expect(retriableDelivery?.processingStartedAt).toBeNull();
  });

  it("returns the delivery to pending when payload decryption fails", async () => {
    const delivery = await createDelivery();

    delivery.encryptedPayload.authTag = Buffer.from("invalid-tag").toString(
      "base64",
    );
    await delivery.save();

    await expect(
      handleEmailDelivery(delivery._id.toString()),
    ).rejects.toThrow();

    expectNoEmailSent();

    const retriableDelivery = await EmailDeliveryModel.findById(delivery._id);

    expect(retriableDelivery?.status).toBe("pending");
    expect(retriableDelivery?.processingStartedAt).toBeNull();
  });

  it("claims a pending delivery atomically and sends it only once", async () => {
    const delivery = await createDelivery();

    await Promise.all([
      handleEmailDelivery(delivery._id.toString()),
      handleEmailDelivery(delivery._id.toString()),
    ]);

    expect(sendAccountVerificationEmail).toHaveBeenCalledTimes(1);
    expect((await EmailDeliveryModel.findById(delivery._id))?.status).toBe(
      "sent",
    );
  });
});

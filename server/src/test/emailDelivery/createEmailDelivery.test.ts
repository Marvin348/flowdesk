import { createEmailDelivery } from "@/features/emailDelivery/services/createEmailDelivery";
import { decryptEmailPayload } from "@/features/emailDelivery/services/decryptEmailPayload";
import { EmailDeliveryModel } from "@/features/emailDelivery/models/emailDelivery.model";
import type { EmailDeliveryType } from "@/features/emailDelivery/types/emailDelivery.document";
import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import mongoose, { Types } from "mongoose";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const createInput = (
  overrides: Partial<{
    rawToken: string;
    userId: Types.ObjectId;
    email: string;
    type: EmailDeliveryType;
  }> = {},
) => ({
  rawToken: "test-token",
  userId: new Types.ObjectId(),
  email: "test@example.com",
  type: "account-verification" as const,
  ...overrides,
});

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("createEmailDelivery", () => {
  it.each<EmailDeliveryType>([
    "account-verification",
    "email_change",
    "password_change",
  ])("persists a pending %s delivery", async (type) => {
    const input = createInput({ type });

    const delivery = await createEmailDelivery(input);
    const persistedDelivery = await EmailDeliveryModel.findById(delivery._id);

    expect(persistedDelivery).not.toBeNull();
    expect(persistedDelivery).toMatchObject({
      userId: input.userId,
      email: input.email,
      type,
      status: "pending",
      queuedAt: null,
      processingStartedAt: null,
    });
    expect(persistedDelivery?.createdAt).toBeInstanceOf(Date);
  });

  it("stores the raw token only as an authenticated encrypted payload", async () => {
    const input = createInput({ rawToken: "sensitive-verification-token" });

    const delivery = await createEmailDelivery(input);
    const persistedDelivery = await EmailDeliveryModel.findById(delivery._id);

    expect(persistedDelivery).not.toBeNull();

    if (!persistedDelivery) {
      throw new Error("Expected email delivery to exist");
    }

    expect(persistedDelivery.encryptedPayload).toEqual({
      ciphertext: expect.any(String),
      iv: expect.any(String),
      authTag: expect.any(String),
    });
    expect(JSON.stringify(persistedDelivery.encryptedPayload)).not.toContain(
      input.rawToken,
    );
    expect(decryptEmailPayload(persistedDelivery.encryptedPayload)).toBe(
      input.rawToken,
    );
  });

  it("uses a fresh IV when encrypting the same raw token twice", async () => {
    const rawToken = "same-token";

    const firstDelivery = await createEmailDelivery(
      createInput({ rawToken }),
    );
    const secondDelivery = await createEmailDelivery(
      createInput({ rawToken }),
    );

    expect(firstDelivery.encryptedPayload.iv).not.toBe(
      secondDelivery.encryptedPayload.iv,
    );
    expect(firstDelivery.encryptedPayload.ciphertext).not.toBe(
      secondDelivery.encryptedPayload.ciphertext,
    );
  });

  it("sets expiresAt to approximately 15 minutes after creation", async () => {
    const beforeCreation = Date.now();

    const delivery = await createEmailDelivery(createInput());

    const afterCreation = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;

    expect(delivery.expiresAt.getTime()).toBeGreaterThanOrEqual(
      beforeCreation + fifteenMinutes,
    );
    expect(delivery.expiresAt.getTime()).toBeLessThanOrEqual(
      afterCreation + fifteenMinutes,
    );
  });

  it("participates in the provided MongoDB session", async () => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const delivery = await createEmailDelivery(createInput(), session);

      expect(
        await EmailDeliveryModel.findById(delivery._id).session(session),
      ).not.toBeNull();

      await session.abortTransaction();

      expect(await EmailDeliveryModel.findById(delivery._id)).toBeNull();
    } finally {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }

      await session.endSession();
    }
  });

  it("does not persist a delivery when payload encryption fails", async () => {
    const previousEncryptionKey = process.env.EMAIL_PAYLOAD_ENCRYPTION_KEY;
    process.env.EMAIL_PAYLOAD_ENCRYPTION_KEY = "invalid-key";

    try {
      await expect(createEmailDelivery(createInput())).rejects.toThrow();

      expect(await EmailDeliveryModel.countDocuments()).toBe(0);
    } finally {
      process.env.EMAIL_PAYLOAD_ENCRYPTION_KEY = previousEncryptionKey;
    }
  });
});

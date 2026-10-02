import { describe, it, expect, vi } from "vitest";
import type { Job } from "bullmq";
import { handleEmailDelivery } from "@/features/email/handlers/handleEmailDelivery";
import { emailJobProcessor } from "@/processors/emailJobProcessor";

vi.mock("@/features/email/handlers/handleEmailDelivery", () => ({
  handleEmailDelivery: vi.fn(),
}));

describe("emailJobProcessor", () => {
  it("passes deliveryId to account-verification job", async () => {
    const job = {
      name: "account-verification",
      data: {
        deliveryId: "delivery-123",
      },
    } as Job;

    await emailJobProcessor(job);

    expect(handleEmailDelivery).toHaveBeenCalledWith("delivery-123");
  });

  it("passes deliveryId to email_change job", async () => {
    const job = {
      name: "email_change",
      data: {
        deliveryId: "delivery-123",
      },
    } as Job;

    await emailJobProcessor(job);

    expect(handleEmailDelivery).toHaveBeenCalledWith("delivery-123");
  });

  it("passes deliveryId to password_change job", async () => {
    const job = {
      name: "password_change",
      data: {
        deliveryId: "delivery-123",
      },
    } as Job;

    await emailJobProcessor(job);

    expect(handleEmailDelivery).toHaveBeenCalledWith("delivery-123");
  });

  it("throws for unknown job name", async () => {
    const job = {
      name: "unknown-job",
      data: {},
    } as Job;

    await expect(emailJobProcessor(job)).rejects.toThrow(
      "Unknown email job: unknown-job",
    );
  });
});

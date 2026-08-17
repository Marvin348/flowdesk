import {
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  clearTestDb,
  connectTestDb,
  disconnectTestDb,
} from "@/test/setupTestDb";
import { createAuthedUserContext } from "@/test/helpers/testFactories";
import { verificationTokenMock } from "@/test/setupVerificationTokenRepositoryMock";
import { createVerificationToken } from "@/features/verification-tokens/services/createVerificationToken.service";
import { hashToken } from "@/utils/hashToken";

beforeAll(async () => {
  await connectTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe("createVerificationToken", () => {
  it("retuns 400 if the emailChange type has no newEmail", async () => {
    const { userId } = await createAuthedUserContext();

    await expect(
      createVerificationToken({
        userId,
        type: "email_change",
      }),
    ).rejects.toMatchObject({
      message: "New email is required for email change token",
      statusCode: 400,
    });
  });

  it("retuns 400 if the passwordChange type has no newPasswordHash", async () => {
    const { userId } = await createAuthedUserContext();

    await expect(
      createVerificationToken({
        userId,
        type: "password_change",
      }),
    ).rejects.toMatchObject({
      message: "New password hash is required",
      statusCode: 400,
    });
  });

  it("retuns a valid token", async () => {
    const { userId } = await createAuthedUserContext();

    const token = await createVerificationToken({
      userId,
      type: "email_verification",
    });

    expect(token).toEqual(expect.any(String));
    expect(token.length).toBeGreaterThan(0);
  });

  it("calls replaceCurrentVerificationToken with hashToken", async () => {
    const { userId } = await createAuthedUserContext();

    const token = await createVerificationToken({
      userId,
      type: "email_verification",
    });

    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        verificationToken: hashToken(token),
        userId: userId.toString(),
        type: "email_verification",
        verificationData: {
          userId: userId.toString(),
          type: "email_verification",
        },
      }),
    );
  });

  it("saves newEmail in verificationData for email_change tokens", async () => {
    const { userId } = await createAuthedUserContext();
    const newEmail = "new@example.com";

    const token = await createVerificationToken({
      userId,
      type: "email_change",
      newEmail,
    });

    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        verificationToken: hashToken(token),
        userId: userId.toString(),
        type: "email_change",
        verificationData: {
          userId: userId.toString(),
          type: "email_change",
          newEmail,
        },
      }),
    );
  });

  it("saves newPasswordHash in verificationData for password_change tokens", async () => {
    const { userId } = await createAuthedUserContext();
    const newPasswordHash = "hashed-new-password";

    const token = await createVerificationToken({
      userId,
      type: "password_change",
      newPasswordHash,
    });

    expect(
      verificationTokenMock.replaceCurrentVerificationToken,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        verificationToken: hashToken(token),
        userId: userId.toString(),
        type: "password_change",
        verificationData: {
          userId: userId.toString(),
          type: "password_change",
          newPasswordHash,
        },
      }),
    );
  });
});

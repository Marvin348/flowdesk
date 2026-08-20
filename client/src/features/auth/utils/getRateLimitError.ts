import axios from "axios";

export const getRateLimitError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error?.response?.status;

    const retryAfter = error?.response?.headers["retry-after"];

    if (status !== 429 || !retryAfter) return undefined;

    return {
      status,
      retryAfter: Number(retryAfter),
      message: "Zu viele Versuche.",
    };
  }
};

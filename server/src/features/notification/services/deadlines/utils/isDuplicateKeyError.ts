export const isDuplicateKeyError = (
  error: unknown,
): error is { code: number } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
};

export const bulidPublicFileUrl = (storageKey?: string) => {
  if (!storageKey) return undefined;

  return `${process.env.R2_PUBLIC_URL}/${storageKey}`;
};

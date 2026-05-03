const avatarModules = import.meta.glob("@/assets/avatars/*.{jpg,png,webp}", {
  eager: true,
  import: "default",
});

export const AVATARS = Object.fromEntries(
  Object.entries(avatarModules).map(([path, src]) => {
    const key = path
      .split("/")
      .pop()!
      .replace(/\.(jpg|png|webp)$/, "");
    return [key, src];
  }),
) as Record<string, string>;

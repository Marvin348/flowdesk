export const requireMappedId = (
  map: Map<string, string>,
  oldId: string,
  label: string,
): string => {
  const newId = map.get(oldId);

  if (!newId) {
    throw new Error(`Missing mapped id for ${label}: ${oldId}`);
  }

  return newId;
};
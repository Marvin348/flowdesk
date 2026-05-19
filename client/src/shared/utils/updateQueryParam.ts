export const updateQueryParam = (
  prev: URLSearchParams,
  key: string,
  value?: string,
  resetPageKey?: string,
) => {
  const params = new URLSearchParams(prev);

  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);

    if (resetPageKey && key !== resetPageKey) {
      params.set(resetPageKey, "1");
    }
  }
  return params;
};

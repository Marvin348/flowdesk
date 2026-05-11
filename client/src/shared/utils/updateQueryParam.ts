export const updateQueryParam = (
  prev: URLSearchParams,
  key: string,
  value?: string,
) => {
  const params = new URLSearchParams(prev);

  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  if (key !== "page") {
    params.set("page", "1");
  }

  return params;
};

export const buildQueryParams = (
  payload: Record<string, string>,
  prefix = '?',
): string => {
  return (
    prefix +
    Object.entries(payload)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value) || ''}`,
      )
      .join('&')
  );
};

export const extractErrorMessage = (error, fallback) => {
  return (
    error?.response?.data?.errors?.[0] ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.statusText ||
    fallback
  );
};

export const parseId = (id: string | string[] | undefined) => {
  const value = Array.isArray(id) ? id[0] : id;

  if (!value || !/^\d+$/.test(value)) {
    throw new Error("Invalid ID");
  }

  return Number(value);
};

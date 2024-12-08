export const validateImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  return validTypes.includes(file.type);
};

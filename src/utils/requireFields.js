import AppError from "./AppError.js";

const toLabel = (field) => {
  const text = field.replace(/([A-Z])/g, " $1").toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const requireFields = (data = {}) => {
  const errors = {};

  for (const [field, value] of Object.entries(data)) {
    const isMissing =
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "");

    if (isMissing) errors[field] = `${toLabel(field)} is required`;
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Validation failed", 400, errors);
  }
};

export default requireFields;
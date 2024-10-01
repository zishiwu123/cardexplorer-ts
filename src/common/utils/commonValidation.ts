import { z } from "zod";

const MAX_SET_NUMBER = 5;

export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  // ... other common validations
  setNumber: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "setNumber must be a numeric value")
    .transform(Number)
    .refine((num) => num >= 1 && num <= MAX_SET_NUMBER, `setNumber must be between 1 and ${MAX_SET_NUMBER}`),
};

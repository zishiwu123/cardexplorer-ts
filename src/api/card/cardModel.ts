import { commonValidations } from "@/common/utils/commonValidation";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

/**
 * When to prefer zod schemas over interfaces, according to ChatGPT
 * 1) Use Zod schemas when you need both runtime validation and TypeScript type safety,
 *    such as in web applications where you're handling incoming data
 *    (e.g., API requests or form submissions) that need validation.
 * 2) Use TypeScript interfaces when you only need static type checking
 *    and don't need to validate data at runtime (e.g., within a trusted system,
 *    or for internal data processing where the data is guaranteed to be correct).
 */
export enum InkColor {
  AMBER = "Amber",
  AMETHYST = "Amethyst",
  EMERALD = "Emerald",
  RUBY = "Ruby",
  SAPPHIRE = "Sapphire",
  STEEL = "Steel",
}

export enum Rarity {
  COMMON = "Common",
  UNCOMMON = "Uncommon",
  RARE = "Rare",
  SUPER_RARE = "Super Rare",
  LEGENDARY = "Legendary",
  ENCHANTED = "Enchanted",
}

extendZodWithOpenApi(z);

export type Card = z.infer<typeof CardSchema>;
export const CardSchema = z.object({
  id: z.number(),
  name: z.string(),
  setNumber: z.number(),
  cardNumber: z.string(),
  inkColor: z.nativeEnum(InkColor),
  rarity: z.nativeEnum(Rarity),
});

export const GetCardByIdSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
});

export const GetCardsSchema = z.object({
  query: z.object({
    name: z.string().optional(),
    setNumber: commonValidations.setNumber.optional(),
    cardNumber: z.string().optional(),
    inkColor: z.nativeEnum(InkColor).optional(),
    rarity: z.nativeEnum(Rarity).optional(),
  }),
});

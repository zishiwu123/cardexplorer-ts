import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CardSchema, GetCardByIdSchema, GetCardsSchema } from "@/api/card/cardModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { cardController } from "../card/cardController";

export const cardRegistry = new OpenAPIRegistry();
export const cardRouter: Router = express.Router();

cardRegistry.register("Card", CardSchema);

cardRegistry.registerPath({
  method: "get",
  path: "/cards",
  tags: ["Card"],
  request: { query: GetCardsSchema.shape.query },
  responses: createApiResponse(z.array(CardSchema), "Success"),
});
cardRouter.get("/", validateRequest(GetCardsSchema), cardController.getCards);

cardRegistry.registerPath({
  method: "get",
  path: "/cards/{id}",
  tags: ["Card"],
  request: { params: GetCardByIdSchema.shape.params },
  responses: createApiResponse(CardSchema, "Success"),
});
cardRouter.get("/:id", validateRequest(GetCardByIdSchema), cardController.getCard);

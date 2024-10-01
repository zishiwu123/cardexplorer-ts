import type { Request, RequestHandler, Response } from "express";

import { cardService } from "@/api/card/cardService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { InkColor, Rarity } from "./cardModel";

class CardController {
  public getCards: RequestHandler = async (req: Request, res: Response) => {
    const name = req.query.name as string;
    const setNumber = Number.parseInt(req.query.setNumber as string, 10);
    const cardNumber = req.query.cardNumber as string;
    const inkColor = req.query.inkColor as InkColor;
    const rarity = req.query.rarity as Rarity;
    console.log("\ngetCards Received query params: ", { name, setNumber, cardNumber, inkColor, rarity });
    let serviceResponse = undefined;
    if (name || setNumber || cardNumber || inkColor || rarity) {
      serviceResponse = await cardService.findByQueryParams(name, setNumber, cardNumber, inkColor, rarity);
    } else {
      serviceResponse = await cardService.findAll();
    }
    return handleServiceResponse(serviceResponse, res);
  };

  public getCard: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await cardService.findById(id);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const cardController = new CardController();

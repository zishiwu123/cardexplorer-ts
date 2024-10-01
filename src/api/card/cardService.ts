import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { Card, InkColor, Rarity } from "./cardModel";
import { CardRepository } from "./cardRepository";

export class CardService {
  private cardRepository: CardRepository;

  constructor(repository: CardRepository = new CardRepository()) {
    this.cardRepository = repository;
  }

  // Retrieves all cards from the database
  async findAll(): Promise<ServiceResponse<Card[] | null>> {
    try {
      const cards = await this.cardRepository.findAllAsync();
      if (!cards || cards.length === 0) {
        return ServiceResponse.failure("No cards found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Cards found", cards, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding all cards: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving cards.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a card by their id
  async findById(id: number): Promise<ServiceResponse<Card | null>> {
    if (Number.isNaN(id)) {
      return ServiceResponse.failure("Invalid input", null, StatusCodes.BAD_REQUEST);
    }
    try {
      const card = await this.cardRepository.findByIdAsync(id);
      if (!card) {
        return ServiceResponse.failure("No card found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Card found", card, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding card: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving card.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves cards by rarity, ink color
  async findByQueryParams(
    name: string,
    setNumber: number,
    cardNumber: string,
    inkColor: InkColor,
    rarity: Rarity,
  ): Promise<ServiceResponse<Card[] | null>> {
    console.log(
      `findByQueryParams - name: ${name}, setNumber: ${setNumber}, cardNumber: ${cardNumber}, inkColor: ${inkColor}, rarity: ${rarity}`,
    );
    try {
      const card = await this.cardRepository.findByQueryParamsAsync(name, setNumber, cardNumber, inkColor, rarity);
      if (!card || card.length === 0) {
        return ServiceResponse.failure("No cards found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Cards found", card, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error finding cards: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving cards.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const cardService = new CardService();

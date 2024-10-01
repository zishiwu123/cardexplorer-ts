import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { Card } from "@/api/card/cardModel";
import { loadCards } from "@/api/card/cardRepository";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { app } from "@/server";

describe("Card API Endpoints", async () => {
  const cards = await loadCards();

  describe("GET /cards", () => {
    it("should return a list of cards if no query params are specified", async () => {
      // Act
      const response = await request(app).get("/cards");
      const responseBody: ServiceResponse<Card[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Cards found");
      expect(responseBody.responseObject.length).toEqual(cards.length);
    });

    it("should return a list of cards with name containing substring 'Ariel' if query param is specified", async () => {
      // Act
      const response = await request(app).get("/cards?name=Ariel");
      const responseBody: ServiceResponse<Card[]> = response.body;
      const NUM_CARDS_WITH_NAME_ARIEL_AFTER_SET_5 = 11;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Cards found");
      expect(responseBody.responseObject.length).toEqual(NUM_CARDS_WITH_NAME_ARIEL_AFTER_SET_5);
    });

    it("should return as many cards as there are sets if a cardNumber is specified", async () => {
      // Act
      const response = await request(app).get("/cards?cardNumber=1");
      const responseBody: ServiceResponse<Card[]> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Cards found");
      expect(responseBody.responseObject.length).toEqual(
        responseBody.responseObject[responseBody.responseObject.length - 1].setNumber,
      );
    });
  });

  describe("GET /cards/:id", () => {
    it("should return a card for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const expectedCard = cards.find((card) => card.id === testId) as Card;

      // Act
      const response = await request(app).get(`/cards/${testId}`);
      const responseBody: ServiceResponse<Card> = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.OK);
      expect(responseBody.success).toBeTruthy();
      expect(responseBody.message).toContain("Card found");
      if (!expectedCard) throw new Error("Invalid test data: expectedCard is undefined");
      compareCards(expectedCard, responseBody.responseObject);
    });

    it("should return a not found error for non-existent ID", async () => {
      // Arrange
      const testId = Number.MAX_SAFE_INTEGER;

      // Act
      const response = await request(app).get(`/cards/${testId}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("No card found");
      expect(responseBody.responseObject).toBeNull();
    });

    it("should return a bad request for invalid ID format", async () => {
      // Arrange
      const invalidInput = "abc";

      // Act
      const response = await request(app).get(`/cards/${invalidInput}`);
      const responseBody: ServiceResponse = response.body;

      // Assert
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      expect(responseBody.success).toBeFalsy();
      expect(responseBody.message).toContain("Invalid input");
      expect(responseBody.responseObject).toBeNull();
    });
  });
});

function compareCards(mockCard: Card, responseCard: Card) {
  if (!mockCard || !responseCard) {
    throw new Error("Invalid test data: mockCard or responseCard is undefined");
  }
  expect(responseCard.id).toEqual(mockCard.id);
  expect(responseCard.name).toEqual(mockCard.name);
  expect(responseCard.setNumber).toEqual(mockCard.setNumber);
  expect(responseCard.cardNumber).toEqual(mockCard.cardNumber);
  expect(responseCard.inkColor).toEqual(mockCard.inkColor);
  expect(responseCard.rarity).toEqual(mockCard.rarity);
}

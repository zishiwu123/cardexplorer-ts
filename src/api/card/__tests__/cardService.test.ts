import { StatusCodes } from "http-status-codes";
import type { Mock } from "vitest";

import { type Card, InkColor, Rarity } from "@/api/card/cardModel";
import { CardRepository } from "@/api/card/cardRepository";
import { CardService } from "@/api/card/cardService";

vi.mock("@/api/card/cardRepository");

describe("userService", () => {
  let cardServiceInstance: CardService;
  let cardRepositoryInstance: CardRepository;

  const mockCards: Card[] = [
    {
      id: 1,
      name: "Ariel - On Human Legs",
      setNumber: 1,
      cardNumber: "1",
      inkColor: InkColor.AMBER,
      rarity: Rarity.UNCOMMON,
    },
    {
      id: 2,
      name: "Ariel - Spectacular Singer",
      setNumber: 1,
      cardNumber: "2",
      inkColor: InkColor.AMBER,
      rarity: Rarity.SUPER_RARE,
    },
  ];

  beforeEach(() => {
    cardRepositoryInstance = new CardRepository();
    cardServiceInstance = new CardService(cardRepositoryInstance);
  });

  describe("findAll", () => {
    it("return all cards", async () => {
      // Arrange
      (cardRepositoryInstance.findAllAsync as Mock).mockReturnValue(mockCards);

      // Act
      const result = await cardServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Cards found");
      expect(result.responseObject).toEqual(mockCards);
    });

    it("returns a not found error for no cards found", async () => {
      // Arrange
      (cardRepositoryInstance.findAllAsync as Mock).mockReturnValue(null);

      // Act
      const result = await cardServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No cards found");
      expect(result.responseObject).toBeNull();
    });

    it("handles errors for findAllAsync", async () => {
      // Arrange
      (cardRepositoryInstance.findAllAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await cardServiceInstance.findAll();

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while retrieving cards.");
      expect(result.responseObject).toBeNull();
    });
  });

  describe("findById", () => {
    it("returns a card for a valid ID", async () => {
      // Arrange
      const testId = 1;
      const mockCard = mockCards.find((card) => card.id === testId);
      (cardRepositoryInstance.findByIdAsync as Mock).mockReturnValue(mockCard);

      // Act
      const result = await cardServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(result.success).toBeTruthy();
      expect(result.message).equals("Card found");
      expect(result.responseObject).toEqual(mockCard);
    });

    it("handles errors for findByIdAsync", async () => {
      // Arrange
      const testId = 1;
      (cardRepositoryInstance.findByIdAsync as Mock).mockRejectedValue(new Error("Database error"));

      // Act
      const result = await cardServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("An error occurred while retrieving card.");
      expect(result.responseObject).toBeNull();
    });

    it("returns a not found error for non-existent ID", async () => {
      // Arrange
      const testId = 1;
      (cardRepositoryInstance.findByIdAsync as Mock).mockReturnValue(null);

      // Act
      const result = await cardServiceInstance.findById(testId);

      // Assert
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
      expect(result.success).toBeFalsy();
      expect(result.message).equals("No card found");
      expect(result.responseObject).toBeNull();
    });
  });
});

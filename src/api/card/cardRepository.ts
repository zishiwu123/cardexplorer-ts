import fs from "node:fs";
import { parse } from "csv-parse";
import { type Card, CardSchema, type InkColor, type Rarity } from "./cardModel";

/**
 * Function to read the CSV and populate the cards array. Courtesy of ChatGPT.
 * Example Card
 *  {
 *     id: 1,
 *     name: "Ariel - On Human Legs",
 *     setNumber: 1,
 *     cardNumber: "1",
 *     inkColor: InkColor.AMBER,
 *     rarity: Rarity.UNCOMMON
 *  }
 */
export const loadCards = (): Promise<Card[]> => {
  return new Promise((resolve, reject) => {
    const cardArray: Card[] = [];

    fs.createReadStream("./data/lorcana_cards.csv")
      .pipe(parse({ delimiter: ",", from_line: 2 }))
      .on("data", (row) => {
        // Map the CSV row to a Card object
        const card = {
          id: Number.parseInt(row[0]),
          name: row[1],
          setNumber: Number.parseInt(row[2]),
          cardNumber: row[3],
          inkColor: row[4] as InkColor,
          rarity: row[5] as Rarity,
        };

        // Validate with Zod and add to the card array
        const validation = CardSchema.safeParse(card);
        if (validation.success) {
          cardArray.push(validation.data);
        } else {
          console.error("Invalid card data: ", validation.error);
        }
      })
      .on("end", () => {
        // Resolve the promise when the file has been fully read
        resolve(cardArray);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export class CardRepository {
  private cards: Card[] = [];

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      this.cards = await loadCards();
      console.log("Cards initialized: ", this.cards.length);
    } catch (error) {
      console.error("Error initializing cards: ", error);
    }
  }
  async findAllAsync(): Promise<Card[]> {
    return this.cards;
  }

  async findByIdAsync(id: number): Promise<Card | null> {
    return this.cards.find((card) => card.id === id) || null;
  }

  async findByQueryParamsAsync(
    name: string,
    setNumber: number,
    cardNumber: string,
    inkColor: InkColor,
    rarity: Rarity,
  ): Promise<Card[] | null> {
    console.log(
      `findByQueryParamsAsync - name: ${name}, setNumber: ${setNumber}, cardNumber: ${cardNumber}, inkColor: ${inkColor}, rarity: ${rarity}`,
    );
    let result = this.cards;
    if (name) {
      result = result.filter((card) => card.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
    }
    if (setNumber) {
      result = result.filter((card) => card.setNumber === setNumber);
    }
    if (cardNumber) {
      result = result.filter((card) => card.cardNumber === cardNumber);
    }
    if (inkColor) {
      result = result.filter((card) => card.inkColor === inkColor);
    }
    if (rarity) {
      result = result.filter((card) => card.rarity === rarity);
    }
    return result;
  }
}

const Airtable = require("airtable");
import { transformData } from "../utils/utils";

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_API_KEY }).base(
  process.env.NEXT_PUBLIC_BASE_KEY
);

export const table = base("stores");

export const findRecordByFilter = async (id) => {
  const findCoffeeStoreRecord = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  if (findCoffeeStoreRecord.length !== 0) {
    return transformData(findCoffeeStoreRecord);
  }

  return [];
};

import { findRecordByFilter, table } from "../../lib/airtable";
import { transformData } from "../../utils/utils";

const faveCoffeeStoreById = async (req, res) => {
  try {
    if (req.method !== "PUT") {
      return res.status(400).json({ message: "method not allowed" });
    }

    if (!req.body.id) {
      return res.status(400).json({ message: "id is required" });
    }

    const records = await findRecordByFilter(req.body.id);

    if (records.length === 0) {
      return res.status(400).json({
        message: `coffee store with the id ${req.body.id}  not found`,
      });
    }

    const newRecord = records[0];

    const newVote = parseInt(newRecord.voting) + 1;

    const updateRecord = await table.update([
      {
        id: newRecord.recordId,
        fields: {
          voting: newVote,
        },
      },
    ]);

    return res.json({
      record: transformData(updateRecord),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "error upvoting coffee store" });
  }
};

export default faveCoffeeStoreById;

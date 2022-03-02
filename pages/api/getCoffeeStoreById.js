import { transformData } from "../../utils/utils";
import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      message: "coffee id is missing",
    });
  }

  try {
    // find a record
    const findCoffeeStoreRecord = await findRecordByFilter(id);

    if (findCoffeeStoreRecord.length !== 0) {
      return res.json({
        findCoffeeStoreRecord,
      });
    } else {
      return res
        .status(400)
        .json({ message: `coffee store with id ${id} not found` });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "something went wrong", error: err.message });
  }
};

export default getCoffeeStoreById;

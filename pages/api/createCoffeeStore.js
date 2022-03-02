import { table } from "../../lib/airtable";
import { transformData } from "../../utils/utils";
import { findRecordByFilter } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
  try {
    if (req.method === "POST") {
      const { id, name, address, neighbourhood, voting, imgUrl } = req.body;

      if (!id) {
        return res.status(400).json({ message: "Please provide id" });
      }

      // find a record
      const findCoffeeStoreRecord = await findRecordByFilter(id);

      if (findCoffeeStoreRecord.length !== 0) {
        return res.json({
          findCoffeeStoreRecord,
        });
      }

      if (!name) {
        return res.status(400).json({ message: "Please provide name" });
      }

      // create a record
      const records = await table.create([
        {
          fields: {
            id,
            name,
            address,
            neighbourhood,
            voting,
            imgUrl,
          },
        },
      ]);

      const transformedRecords = transformData(records);

      return res
        .status(200)
        .json({ message: "records created", records: transformedRecords });
    }

    res.status(200).json({ message: "Coffee store created" });
  } catch (e) {
    console.error("error finding or creating a coffee store", e);
    res.status(500).json({ message: "error finding coffee store" });
  }
};

export default createCoffeeStore;

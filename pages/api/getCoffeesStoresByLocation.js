import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeesStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await fetchCoffeeStores(latLong);

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something went wrong" + err });
  }
};

export default getCoffeesStoresByLocation;

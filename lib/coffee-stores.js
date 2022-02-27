import { createApi } from "unsplash-js";

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
  const response = await fetch(
    getUrlForCoffeeStores(
      "43.65267326999575,-79.39545615725015",
      "coffee stores&v=20220105",
      8
    ),
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );
  const data = await response.json();

  const transformedData =
    data?.results?.map((venue) => {
      return {
        id: venue.fsq_id,
        ...venue,
      };
    }) || [];

  const pics = await fetch(
    `https://api.unsplash.com/search/photos?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}&query=coffee shop`
  );

  const picsData = await pics.json();

  const allPics = picsData.results.map((pic) => pic.urls.small);

  const coffeeShops = transformedData.map((store, idx) => {
    return {
      ...store,
      imgUrl: allPics[idx],
    };
  });

  return coffeeShops;
};

/**
 * {
      id: venue.fsq_id, // <------
      address: venue.location.address || "",
      name: venue.name,
      neighbourhood: (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) || venue.location.cross_street || "",
      imgUrl: photos[idx],
    };
 */

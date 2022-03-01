import { useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../context/store-context";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  // const [latLng, setLatLng] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    setIsFetchingLocation(false);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLocationErrorMsg("");
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: `${latitude},${longitude}`,
    });
    // setLatLng(`${latitude},${longitude}`);
  };

  const error = (error) => {
    setIsFetchingLocation(false);
    setLocationErrorMsg("Geolocation is not supported by your browser");
  };

  const handleTrackLocation = () => {
    setIsFetchingLocation(true);
    if (!navigator.geolocation) {
      //   status.textContent = "Geolocation is not supported by your browser";
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsFetchingLocation(false);
    } else {
      //   status.textContent = "Locating…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    locationErrorMsg,
    // latLng,
    error,
    handleTrackLocation,
    isFetchingLocation,
  };
};

export default useTrackLocation;

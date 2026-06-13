import { useState, useEffect } from "react";
import { getRestaurants, createRestaurant } from "../api.js";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants();
      setRestaurants(data);
    };
    fetchRestaurants();
  }, []);

  async function addRestaurant(restaurant) {
    await createRestaurant(restaurant);
    const data = await getRestaurants();
    setRestaurants(data);
  }

  return { restaurants, addRestaurant };
}

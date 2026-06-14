import { useState, useEffect, useCallback } from "react";
import { getRestaurants, createRestaurant } from "../api.js";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);

  const fetchRestaurants = useCallback(async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  }, []);

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  async function addRestaurant(restaurant) {
    await createRestaurant(restaurant);
    await fetchRestaurants();
  }

  return { restaurants, addRestaurant };
}

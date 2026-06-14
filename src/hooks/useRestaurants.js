import { useCallback, useEffect, useState } from "react";
import { getRestaurants, addRestaurant } from "../api";

export function useRestaurants() {
  const [newRestaurants, setNewRestaurants] = useState([]);

  const fetchRestaurants = useCallback(async () => {
    const data = await getRestaurants();
    setNewRestaurants(data);
  }, []);

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  async function registerRestaurant(newRestaurant) {
    await addRestaurant(newRestaurant);
    await fetchRestaurants();
  }

  return { newRestaurants, registerRestaurant };
}

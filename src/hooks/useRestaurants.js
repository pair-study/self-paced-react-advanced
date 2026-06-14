import { useCallback, useEffect, useState } from "react";
import { getRestaurants, addRestaurant } from "../api";

export function useRestaurants() {
  const [newRestaurants, setNewRestaurants] = useState([]);
  const [error, setError] = useState();

  const fetchRestaurants = useCallback(async () => {
    try {
      const data = await getRestaurants();
      setNewRestaurants(data);
    } catch (e) {
      setError("음식점 목록을 불러오지 못했습니다.");
    }
  }, []);

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  async function registerRestaurant(newRestaurant) {
    await addRestaurant(newRestaurant);
    await fetchRestaurants();
  }

  return { newRestaurants, registerRestaurant, error };
}

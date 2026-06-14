import { useState, useEffect, useCallback } from "react";
import { getRestaurants, createRestaurant } from "../api.js";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRestaurants = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      setError("음식점 목록을 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  async function addRestaurant(restaurant) {
    await createRestaurant(restaurant);
    await fetchRestaurants();
  }

  return { restaurants, addRestaurant, isLoading, error };
}

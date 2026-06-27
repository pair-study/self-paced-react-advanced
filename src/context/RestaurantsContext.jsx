import { createContext } from "react";
import { useRestaurants } from "../hooks/useRestaurants.js";

export const RestaurantsContext = createContext(null);

export function RestaurantsProvider({ children }) {
  const { restaurants, addRestaurant, isLoading, error } = useRestaurants();
  return (
    <RestaurantsContext.Provider
      value={{ restaurants, addRestaurant, isLoading, error }}
    >
      {children}
    </RestaurantsContext.Provider>
  );
}

import { createContext } from "react";
import { useRestaurants } from "../hooks/useRestaurants";

export const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const { newRestaurants, registerRestaurant, error, isLoading } =
    useRestaurants();

  return (
    <RestaurantContext.Provider
      value={{
        newRestaurants,
        registerRestaurant,
        error,
        isLoading,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

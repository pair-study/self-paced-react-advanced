/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useRestaurants } from "../hooks/useRestaurants";
import { ALL_CATEGORY } from "../constants/categories";

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  const { newRestaurants, registerRestaurant, error, isLoading } =
    useRestaurants();
  const [category, setCategory] = useState(ALL_CATEGORY);

  const filteredRestaurants =
    category === ALL_CATEGORY
      ? newRestaurants
      : newRestaurants.filter((r) => r.category === category);

  const handleSelectChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <RestaurantContext.Provider
      value={{
        registerRestaurant,
        error,
        isLoading,
        category,
        filteredRestaurants,
        handleSelectChange,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurantContext() {
  return useContext(RestaurantContext);
}

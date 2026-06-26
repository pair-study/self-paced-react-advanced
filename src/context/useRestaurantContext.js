import { useContext } from "react";
import { RestaurantContext } from "./RestaurantContext";

export function useRestaurantContext() {
  return useContext(RestaurantContext);
}

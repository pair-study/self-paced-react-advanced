import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../api";
import { restaurantKeys } from "./queryKeys";

export function useRestaurantsQuery() {
  return useQuery({
    queryKey: restaurantKeys.all(),
    queryFn: getRestaurants,
  });
}

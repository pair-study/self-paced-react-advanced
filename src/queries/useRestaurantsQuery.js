import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../api";

export function useRestaurantsQuery() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: getRestaurants,
  });
}

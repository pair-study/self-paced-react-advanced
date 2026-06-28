import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "../api";
import { RESTAURANTS_QUERY_KEY } from "../constants/queryKeys";

export function useRestaurantsQuery() {
  return useQuery({
    queryKey: RESTAURANTS_QUERY_KEY,
    queryFn: getRestaurants,
  });
}

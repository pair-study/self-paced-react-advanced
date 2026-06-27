import useRestaurantStore from "../store/useRestaurantStore";

export function useRestaurantData() {
  const newRestaurants = useRestaurantStore((state) => state.newRestaurants);
  const isLoading = useRestaurantStore((state) => state.isLoading);
  const error = useRestaurantStore((state) => state.error);
  const fetchRestaurants = useRestaurantStore((state) => state.fetchRestaurants);
  const registerRestaurant = useRestaurantStore(
    (state) => state.registerRestaurant,
  );

  return { newRestaurants, isLoading, error, fetchRestaurants, registerRestaurant };
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRestaurant } from "../api";
import { restaurantKeys } from "./queryKeys";

export function useAddRestaurantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRestaurant,
    onMutate: async (newRestaurant) => {
      await queryClient.cancelQueries({ queryKey: restaurantKeys.all() });

      const previousRestaurants = queryClient.getQueryData(restaurantKeys.all());

      queryClient.setQueryData(restaurantKeys.all(), (old) => [
        ...old,
        { ...newRestaurant, id: crypto.randomUUID() },
      ]);

      return { previousRestaurants };
    },
    onError: (_err, _newRestaurant, context) => {
      queryClient.setQueryData(restaurantKeys.all(), context.previousRestaurants);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: restaurantKeys.all() });
    },
  });
}

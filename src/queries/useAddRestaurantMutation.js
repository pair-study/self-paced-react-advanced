import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRestaurant } from "../api";

export function useAddRestaurantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRestaurant,
    onMutate: async (newRestaurant) => {
      await queryClient.cancelQueries({ queryKey: ["restaurants"] });

      const previousRestaurants = queryClient.getQueryData(["restaurants"]);

      queryClient.setQueryData(["restaurants"], (old) => [
        ...old,
        { ...newRestaurant, id: crypto.randomUUID() },
      ]);

      return { previousRestaurants };
    },
    onError: (_err, _newRestaurant, context) => {
      queryClient.setQueryData(["restaurants"], context.previousRestaurants);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
}

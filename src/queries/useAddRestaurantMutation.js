import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRestaurant } from "../api";
import { RESTAURANTS_QUERY_KEY } from "../constants/queryKeys";

export function useAddRestaurantMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRestaurant,
    onMutate: async (newRestaurant) => {
      await queryClient.cancelQueries({ queryKey: RESTAURANTS_QUERY_KEY });
      const previous = queryClient.getQueryData(RESTAURANTS_QUERY_KEY);
      const optimisticItem = {
        id: `optimistic-${Date.now()}`,
        ...newRestaurant,
      };
      queryClient.setQueryData(RESTAURANTS_QUERY_KEY, (old) => {
        const current = Array.isArray(old) ? old : [];
        return [...current, optimisticItem];
      });
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(RESTAURANTS_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: RESTAURANTS_QUERY_KEY });
    },
  });
}

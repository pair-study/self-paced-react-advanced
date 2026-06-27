import { create } from "zustand";
import { getRestaurants, addRestaurant } from "../api";

const useRestaurantStore = create((set, get) => ({
  newRestaurants: [],
  error: null,
  isLoading: false,

  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRestaurants();
      set({ newRestaurants: data });
    } catch {
      set({ error: "음식점 목록을 불러오지 못했습니다." });
    } finally {
      set({ isLoading: false });
    }
  },

  registerRestaurant: async (newRestaurant) => {
    await addRestaurant(newRestaurant);
    await get().fetchRestaurants();
  },
}));

export default useRestaurantStore;

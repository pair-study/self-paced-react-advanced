import { create } from "zustand";
import { getRestaurants, createRestaurant } from "../api.js";

const useRestaurantStore = create((set, get) => ({
  // 상태
  restaurants: [],
  isLoading: false,
  error: null,

  // 액션
  fetchRestaurants: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getRestaurants();
      set({ restaurants: data });
    } catch {
      set({ error: "음식점 목록을 불러오지 못했습니다." });
    } finally {
      set({ isLoading: false });
    }
  },
  addRestaurant: async (restaurant) => {
    await createRestaurant(restaurant);
    await get().fetchRestaurants();
  },
}));

export default useRestaurantStore;

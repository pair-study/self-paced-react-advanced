import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getRestaurants, createRestaurant } from "../api.js";
import { ALL_CATEGORY } from "../constants/categories.js";

const useRestaurantStore = create(
  persist(
    (set, get) => ({
      // 상태
      restaurants: [],
      isLoading: false,
      error: null,
      selectedCategory: ALL_CATEGORY,

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
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: "restaurant-storage",
      partialize: (state) => ({ selectedCategory: state.selectedCategory }),
    },
  ),
);

export default useRestaurantStore;

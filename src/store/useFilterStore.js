import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ALL_CATEGORY } from "../constants/categories.js";

const useFilterStore = create(
  persist(
    (set) => ({
      // 상태
      selectedCategory: ALL_CATEGORY,

      // 액션
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    {
      name: "category-filter",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useFilterStore;

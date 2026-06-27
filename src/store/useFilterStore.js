import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ALL_CATEGORY } from "../constants/categories";

const useFilterStore = create(
  persist(
    (set) => ({
      selectedCategory: ALL_CATEGORY,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
    }),
    { name: "self-paced-react-category" },
  ),
);

export default useFilterStore;

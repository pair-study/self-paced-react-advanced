import "./App.css";
import { useEffect, useState } from "react";
import Header from "./components/Header/Header";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import RestaurantList from "./components/RestaurantList/RestaurantList";
import RestaurantDetailModal from "./components/Modal/RestaurantDetailModal";
import AddRestaurantModal from "./components/Modal/AddRestaurantModal";
import useRestaurantStore from "./store/useRestaurantStore";
import useFilterStore from "./store/useFilterStore";

export default function App() {
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectedCategory = useFilterStore((state) => state.selectedCategory);
  const setSelectedCategory = useFilterStore(
    (state) => state.setSelectedCategory,
  );
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleRestaurantClick = (restaurant) =>
    setClickedRestaurant(restaurant);
  const handleDetailModalClose = () => setClickedRestaurant(null);
  const handleAddModalOpen = () => setIsAddModalOpen(true);
  const handleAddModalClose = () => setIsAddModalOpen(false);

  const fetchRestaurants = useRestaurantStore((state) => state.fetchRestaurants);
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  return (
    <>
      <Header onAddModalOpen={handleAddModalOpen} />
      <main>
        <CategoryFilter
          category={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <RestaurantList
          selectedCategory={selectedCategory}
          onRestaurantClick={handleRestaurantClick}
        />
      </main>
      <aside>
        {clickedRestaurant && (
          <RestaurantDetailModal
            restaurant={clickedRestaurant}
            onClose={handleDetailModalClose}
          />
        )}
        {isAddModalOpen && <AddRestaurantModal onClose={handleAddModalClose} />}
      </aside>
    </>
  );
}

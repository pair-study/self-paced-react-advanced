import "./App.css";
import { useState } from "react";
import Header from "./components/Header/Header";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import RestaurantList from "./components/RestaurantList/RestaurantList";
import RestaurantDetailModal from "./components/Modal/RestaurantDetailModal";
import AddRestaurantModal from "./components/Modal/AddRestaurantModal";
import { useRestaurantContext } from "./context/useRestaurantContext";

export default function App() {
  const { error, isLoading } = useRestaurantContext();
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleRestaurantClick = (restaurant) => setClickedRestaurant(restaurant);
  const handleDetailModalClose = () => setClickedRestaurant(null);
  const handleAddModalOpen = () => setIsAddModalOpen(true);
  const handleAddModalClose = () => setIsAddModalOpen(false);

  return (
    <>
      <Header onAddModalOpen={handleAddModalOpen} />
      <main>
        {isLoading && <p>로딩중입니다.</p>}
        {error && <p>{error}</p>}
        <CategoryFilter />
        <RestaurantList onRestaurantClick={handleRestaurantClick} />
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

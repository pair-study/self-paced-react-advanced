import "./App.css";
import Header from "./components/Header/Header.jsx";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter.jsx";
import RestaurantList from "./components/RestaurantList/RestaurantList.jsx";
import { useState } from "react";
import { filterRestaurants } from "./utils/filterRestaurants.js";
import RestaurantDetailModal from "./components/RestaurantDetailModal/RestaurantDetailModal.jsx";
import AddRestaurantModal from "./components/AddRestaurantModal/AddRestaurantModal.jsx";
import { useRestaurants } from "./hooks/useRestaurants.js";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] =
    useState(false);
  const { restaurants, addRestaurant } = useRestaurants();

  const isRestaurantDetailModalOpen = !!clickedRestaurant;
  const filteredRestaurants = filterRestaurants(restaurants, selectedCategory);

  function handleCategoryChange(e) {
    setSelectedCategory(e.target.value);
  }

  function handleRestaurantClick(restaurant) {
    setClickedRestaurant(restaurant);
  }

  function handleDetailModalClose() {
    setClickedRestaurant(null);
  }

  function handleAddButtonClick() {
    setIsAddRestaurantModalOpen(true);
  }

  function handleAddRestaurantModalClose() {
    setIsAddRestaurantModalOpen(false);
  }

  async function handleRestaurantSubmit(restaurant) {
    await addRestaurant(restaurant);
    setIsAddRestaurantModalOpen(false);
  }

  return (
    <>
      <Header onAddButtonClick={handleAddButtonClick} />
      <main>
        <CategoryFilter
          category={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <RestaurantList
          restaurants={filteredRestaurants}
          onRestaurantClick={handleRestaurantClick}
        />
      </main>
      <aside>
        {isRestaurantDetailModalOpen && (
          <RestaurantDetailModal
            restaurant={clickedRestaurant}
            onClose={handleDetailModalClose}
          />
        )}
        {isAddRestaurantModalOpen && (
          <AddRestaurantModal
            onSubmit={handleRestaurantSubmit}
            onClose={handleAddRestaurantModalClose}
          />
        )}
      </aside>
    </>
  );
}

export default App;

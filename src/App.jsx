import "./App.css";
import Header from "./components/Header.jsx";
import CategoryFilter from "./components/CategoryFilter.jsx";
import RestaurantList from "./components/RestaurantList.jsx";
import { useState } from "react";
import { filterRestaurants } from "./utils/filterRestaurants.js";
import RestaurantDetailModal from "./components/RestaurantDetailModal.jsx";
import AddRestaurantModal from "./components/AddRestaurantModal.jsx";
import { useRestaurants } from "./hooks/useRestaurants.js";
import { ALL_CATEGORY } from "./constants/categories.js";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] =
    useState(false);
  const { restaurants, addRestaurant, isLoading, error } = useRestaurants();

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
    try {
      await addRestaurant(restaurant);
      setIsAddRestaurantModalOpen(false);
    } catch {
      alert("음식점 추가에 실패했습니다. 다시 시도해주세요.");
    }
  }

  return (
    <>
      <Header onAddButtonClick={handleAddButtonClick} />
      <main>
        {isLoading && <p>불러오는 중...</p>}
        {error && <p>{error}</p>}
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

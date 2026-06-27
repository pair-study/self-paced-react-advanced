import "./App.css";
import Header from "./components/Header.jsx";
import CategoryFilter from "./components/CategoryFilter.jsx";
import RestaurantList from "./components/RestaurantList.jsx";
import { useState } from "react";
import RestaurantDetailModal from "./components/RestaurantDetailModal.jsx";
import AddRestaurantModal from "./components/AddRestaurantModal.jsx";
import { ALL_CATEGORY } from "./constants/categories.js";
import { RestaurantsProvider } from "./context/RestaurantsContext.jsx";

function App() {
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] =
    useState(false);
  const isRestaurantDetailModalOpen = !!clickedRestaurant;

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

  return (
    <RestaurantsProvider>
      <Header onAddButtonClick={handleAddButtonClick} />
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
        {isRestaurantDetailModalOpen && (
          <RestaurantDetailModal
            restaurant={clickedRestaurant}
            onClose={handleDetailModalClose}
          />
        )}
        {isAddRestaurantModalOpen && (
          <AddRestaurantModal onClose={handleAddRestaurantModalClose} />
        )}
      </aside>
    </RestaurantsProvider>
  );
}

export default App;

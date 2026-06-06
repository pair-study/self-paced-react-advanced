import "./App.css";
import Header from "./components/Header/Header.jsx";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter.jsx";
import RestaurantList from "./components/RestaurantList/RestaurantList.jsx";
import { useState } from "react";
import { filterRestaurants } from "./utils/filterRestaurants.js";
import { RESTAURANTS } from "./constants/restaurants.js";
import RestaurantDetailModal from "./components/RestaurantDetailModal/RestaurantDetailModal.jsx";

function App() {
  const [category, setCategory] = useState("전체");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const filteredRestaurants = filterRestaurants(RESTAURANTS, category);

  function handleChange(e) {
    setCategory(e.target.value);
  }

  function handleRestaurantSelect(restaurant) {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  }

  return (
    <>
      <Header />
      <main>
        <CategoryFilter category={category} onChangeCategory={handleChange} />
        <RestaurantList
          restaurants={filteredRestaurants}
          onSelect={handleRestaurantSelect}
        />
      </main>
      <aside>
        {isModalOpen && (
          <RestaurantDetailModal
            restaurant={selectedRestaurant}
            onClose={handleModalClose}
          />
        )}
      </aside>
    </>
  );
}

export default App;

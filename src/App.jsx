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
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const isRestaurantDetailModalOpen = !!clickedRestaurant;
  const filteredRestaurants = filterRestaurants(RESTAURANTS, category);

  function handleChange(e) {
    setCategory(e.target.value);
  }

  function handleRestaurantClick(restaurant) {
    setClickedRestaurant(restaurant);
  }

  function handleModalClose() {
    setClickedRestaurant(null);
  }

  return (
    <>
      <Header />
      <main>
        <CategoryFilter category={category} onChangeCategory={handleChange} />
        <RestaurantList
          restaurants={filteredRestaurants}
          onRestaurantClick={handleRestaurantClick}
        />
      </main>
      <aside>
        {isRestaurantDetailModalOpen && (
          <RestaurantDetailModal
            restaurant={clickedRestaurant}
            onClose={handleModalClose}
          />
        )}
      </aside>
    </>
  );
}

export default App;

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
  const filteredRestaurants = filterRestaurants(RESTAURANTS, category);

  function handleChange(e) {
    setCategory(e.target.value);
  }

  function handleModalOpen() {
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
  }

  return (
    <>
      <Header />
      <main>
        <CategoryFilter category={category} onChangeCategory={handleChange} />
        <RestaurantList
          restaurants={filteredRestaurants}
          onSelect={handleModalOpen}
        />
      </main>
      <aside>
        {isModalOpen && <RestaurantDetailModal onClose={handleModalClose} />}
      </aside>
    </>
  );
}

export default App;

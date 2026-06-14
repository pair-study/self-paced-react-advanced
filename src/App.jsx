import { ALL_CATEGORY } from "./constants/categories";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import RestaurantList from "./components/RestaurantList/RestaurantList";
import RestaurantDetailModal from "./components/Modal/RestaurantDetailModal";
import AddRestaurantModal from "./components/Modal/AddRestaurantModal";

const BASE_URL = "http://localhost:3000";

function App() {
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRestaurants, setNewRestaurants] = useState([]);

  const fetchRestaurants = useCallback(async () => {
    const response = await fetch(`${BASE_URL}/restaurants`);
    const data = await response.json();
    setNewRestaurants(data);
  }, []);

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  const handleFormSubmit = async (newRestaurant) => {
    await fetch("http://localhost:3000/restaurants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRestaurant),
    });
    await fetchRestaurants();
    setIsAddModalOpen(false);
  };

  const filteredRestaurants =
    category === ALL_CATEGORY
      ? newRestaurants
      : newRestaurants.filter((restaurant) => restaurant.category === category);

  const handleSelectChange = (e) => {
    setCategory(e.target.value);
  };

  const handleRestaurantClick = (restaurant) => {
    setClickedRestaurant(restaurant);
  };

  const handleDetailModalClose = () => {
    setClickedRestaurant(null);
  };

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  return (
    <>
      <Header onClick={handleAddModalOpen} />
      <main>
        <CategoryFilter
          category={category}
          onChangeCategory={handleSelectChange}
        />
        <RestaurantList
          restaurants={filteredRestaurants}
          onRestaurantClick={handleRestaurantClick}
        />
      </main>
      <aside>
        {clickedRestaurant && (
          <RestaurantDetailModal
            clickedRestaurant={clickedRestaurant}
            onClose={handleDetailModalClose}
          />
        )}
        {isAddModalOpen && (
          <AddRestaurantModal
            onSubmit={handleFormSubmit}
            onClose={handleAddModalClose}
          />
        )}
      </aside>
    </>
  );
}

export default App;

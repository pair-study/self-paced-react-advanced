import { useState } from "react";
import "./App.css";
import { restaurants } from "./constants/restaurants";
import Header from "./components/Header/Header";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import RestaurantList from "./components/RestaurantList/RestaurantList";
import RestaurantDetailModal from "./components/Modal/RestaurantDetailModal";
import AddRestaurantModal from "./components/Modal/AddRestaurantModal";

function App() {
  const [category, setCategory] = useState("전체");
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRestaurants, setNewRestaurants] = useState(restaurants);

  const handleFormSubmit = (newRestaurant) => {
    setNewRestaurants([...newRestaurants, newRestaurant]);
    setIsAddModalOpen(false);
  };

  const filteredRestaurants =
    category === "전체"
      ? newRestaurants
      : newRestaurants.filter((restaurant) => restaurant.category === category);

  const handleSelectChange = (e) => {
    setCategory(e.target.value);
  };

  const handleRestaurantClick = (restaurant) => {
    setClickedRestaurant(restaurant);
  };

  const handleModalClose = () => {
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
            onClose={handleModalClose}
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

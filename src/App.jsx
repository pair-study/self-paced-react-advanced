import { ALL_CATEGORY } from "./constants/categories";
import { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import RestaurantList from "./components/RestaurantList/RestaurantList";
import RestaurantDetailModal from "./components/Modal/RestaurantDetailModal";
import AddRestaurantModal from "./components/Modal/AddRestaurantModal";
import { useRestaurants } from "./hooks/useRestaurants";

function App() {
  const [category, setCategory] = useState(ALL_CATEGORY);
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { newRestaurants, registerRestaurant, error } = useRestaurants();

  const handleFormSubmit = async (newRestaurant) => {
    try {
      await registerRestaurant(newRestaurant);
      setIsAddModalOpen(false);
    } catch {
      alert("음식점 추가에 실패했습니다. 다시 시도해주세요.");
    }
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
        {error && <p>{error}</p>}
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

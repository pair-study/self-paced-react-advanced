import "./App.css";
import Header from "./components/Header/Header.jsx";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter.jsx";
import RestaurantList from "./components/RestaurantList/RestaurantList.jsx";
import { useEffect, useState } from "react";
import { filterRestaurants } from "./utils/filterRestaurants.js";
import RestaurantDetailModal from "./components/RestaurantDetailModal/RestaurantDetailModal.jsx";
import AddRestaurantModal from "./components/AddRestaurantModal/AddRestaurantModal.jsx";
import { getRestaurants, postRestaurant } from "./api.js";

function App() {
  const [filterCategory, setFilterCategory] = useState("전체");
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] =
    useState(false);
  const [restaurants, setRestaurants] = useState([]);

  const isRestaurantDetailModalOpen = !!clickedRestaurant;
  const filteredRestaurants = filterRestaurants(restaurants, filterCategory);

  useEffect(() => {
    (async () => {
      const restaurants = await getRestaurants();
      setRestaurants(restaurants);
    })();
  }, []);

  function handleFilterCategoryChange(e) {
    setFilterCategory(e.target.value);
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

  async function handleRestaurantSubmit({ category, name, description }) {
    await postRestaurant({ category, name, description });
    setIsAddRestaurantModalOpen(false);
    const restaurants = await getRestaurants();
    setRestaurants(restaurants);
  }

  return (
    <>
      <Header onAddButtonClick={handleAddButtonClick} />
      <main>
        <CategoryFilter
          category={filterCategory}
          onCategoryChange={handleFilterCategoryChange}
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

import "./App.css";
import Header from "./components/Header/Header.jsx";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter.jsx";
import RestaurantList from "./components/RestaurantList/RestaurantList.jsx";
import { useState } from "react";
import { filterRestaurants } from "./utils/filterRestaurants.js";
import { RESTAURANTS } from "./constants/restaurants.js";
import RestaurantDetailModal from "./components/RestaurantDetailModal/RestaurantDetailModal.jsx";
import AddRestaurantModal from "./components/AddRestaurantModal/AddRestaurantModal.jsx";

function App() {
  const [filterCategory, setFilterCategory] = useState("전체");
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] =
    useState(false);
  const [restaurants, setRestaurants] = useState(RESTAURANTS);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isRestaurantDetailModalOpen = !!clickedRestaurant;
  const filteredRestaurants = filterRestaurants(restaurants, filterCategory);

  function handleChange(e) {
    setFilterCategory(e.target.value);
  }

  function handleRestaurantClick(restaurant) {
    setClickedRestaurant(restaurant);
  }

  function handleModalClose() {
    setClickedRestaurant(null);
  }

  function handleAddButtonClick() {
    setIsAddRestaurantModalOpen(true);
  }

  function handleAddRestaurantModalClose() {
    setIsAddRestaurantModalOpen(false);
  }

  function handleCategoryChange(e) {
    setCategory(e.target.value);
  }

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    setRestaurants([
      ...restaurants,
      {
        id: Date.now(),
        category,
        name,
        description,
      },
    ]);

    setIsAddRestaurantModalOpen(false);
    setCategory("");
    setName("");
    setDescription("");
  }

  return (
    <>
      <Header onAddButtonClick={handleAddButtonClick} />
      <main>
        <CategoryFilter
          category={filterCategory}
          onChangeCategory={handleChange}
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
            onClose={handleModalClose}
          />
        )}
        {isAddRestaurantModalOpen && (
          <AddRestaurantModal
            category={category}
            name={name}
            description={description}
            handleCategoryChange={handleCategoryChange}
            handleNameChange={handleNameChange}
            handleDescriptionChange={handleDescriptionChange}
            onSubmit={handleSubmit}
            onClose={handleAddRestaurantModalClose}
          />
        )}
      </aside>
    </>
  );
}

export default App;

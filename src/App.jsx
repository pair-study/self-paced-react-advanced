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

  const filteredRestaurants =
    category === "전체"
      ? restaurants
      : restaurants.filter((restaurant) => restaurant.category === category);

  const handleSelectChange = (e) => {
    setCategory(e.target.value);
  };

  return (
    <>
      <Header />
      <main>
        <CategoryFilter
          category={category}
          onChangeCategory={handleSelectChange}
        />
        <RestaurantList restaurants={filteredRestaurants} />
      </main>
      <aside>
        <RestaurantDetailModal />
        <AddRestaurantModal />
      </aside>
    </>
  );
}

export default App;

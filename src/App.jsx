import { useState } from "react";
import "./App.css";
import { restaurants } from "./utils/restaurants";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import RestaurantList from "./RestaurantList";
import RestaurantDetailModal from "./RestaurantDetailModal";
import AddRestaurantModal from "./AddRestaurantModal";

function App() {
  const [category, setCategory] = useState("전체");

  const filteredRestaurants =
    category === "전체"
      ? restaurants
      : restaurants.filter((restaurant) => restaurant.category === category);

  return (
    <>
      <Header />
      <main>
        <CategoryFilter category={category} onChangeCategory={setCategory} />
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

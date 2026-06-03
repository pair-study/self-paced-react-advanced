import "./App.css";
import Header from "./components/Header/Header.jsx";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter.jsx";
import RestaurantList from "./components/RestaurantList/RestaurantList.jsx";
import { useState } from "react";
import { filterRestaurants } from "./utils/filterRestaurants.js";
import { RESTAURANTS } from "./constants/restaurants.js";
// import RestaurantDetailModal from "./components/RestaurantDetailModal/RestaurantDetailModal.jsx";
// import AddRestaurantModal from "./components/AddRestaurantModal/AddRestaurantModal.jsx";

function App() {
  const [category, setCategory] = useState("전체");
  const filteredRestaurants = filterRestaurants(RESTAURANTS, category);

  function handleChange(e) {
    setCategory(e.target.value);
  }

  return (
    <>
      <Header />
      <main>
        <CategoryFilter category={category} onChangeCategory={handleChange} />
        <RestaurantList restaurants={filteredRestaurants} />
      </main>
      {/* <aside>
        <RestaurantDetailModal />
        <AddRestaurantModal />
      </aside> */}
    </>
  );
}

export default App;

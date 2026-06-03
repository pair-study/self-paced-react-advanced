import "./App.css";
import { restaurants } from "./utils/restaurants";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import RestaurantList from "./RestaurantList";
import RestaurantDetailModal from "./RestaurantDetailModal";
import AddRestaurantModal from "./AddRestaurantModal";

function App() {
  return (
    <>
      <Header />
      <main>
        <CategoryFilter />
        <RestaurantList restaurants={restaurants} />
      </main>
      <aside>
        <RestaurantDetailModal />
        <AddRestaurantModal />
      </aside>
    </>
  );
}

export default App;

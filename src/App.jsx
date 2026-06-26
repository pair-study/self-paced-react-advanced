import "./App.css";
import Header from "./components/Header/Header";
import CategoryFilter from "./components/CategoryFilter/CategoryFilter";
import RestaurantList from "./components/RestaurantList/RestaurantList";
import RestaurantDetailModal from "./components/Modal/RestaurantDetailModal";
import AddRestaurantModal from "./components/Modal/AddRestaurantModal";
import { useRestaurantContext } from "./context/useRestaurantContext";
import { useModalContext } from "./context/useModalContext";

export default function App() {
  const { error, isLoading } = useRestaurantContext();
  const { clickedRestaurant, isAddModalOpen } = useModalContext();

  return (
    <>
      <Header />
      <main>
        {isLoading && <p>로딩중입니다.</p>}
        {error && <p>{error}</p>}
        <CategoryFilter />
        <RestaurantList />
      </main>
      <aside>
        {clickedRestaurant && <RestaurantDetailModal />}
        {isAddModalOpen && <AddRestaurantModal />}
      </aside>
    </>
  );
}

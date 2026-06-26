import Header from "./Header/Header";
import CategoryFilter from "./CategoryFilter/CategoryFilter";
import RestaurantList from "./RestaurantList/RestaurantList";
import RestaurantDetailModal from "./Modal/RestaurantDetailModal";
import AddRestaurantModal from "./Modal/AddRestaurantModal";
import { useRestaurantContext } from "../context/RestaurantContext";
import { useModalContext } from "../context/ModalContext";

export default function AppContent() {
  const { error, isLoading } = useRestaurantContext();
  const { clickedRestaurant, isAddModalOpen, handleAddModalOpen } = useModalContext();

  return (
    <>
      <Header onClick={handleAddModalOpen} />
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

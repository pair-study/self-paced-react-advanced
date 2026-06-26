import { createContext, useState } from "react";
import { useRestaurantContext } from "./useRestaurantContext";

export const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const { registerRestaurant } = useRestaurantContext();
  const [clickedRestaurant, setClickedRestaurant] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const handleFormSubmit = async (newRestaurant) => {
    try {
      await registerRestaurant(newRestaurant);
      setIsAddModalOpen(false);
    } catch {
      alert("음식점 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <ModalContext.Provider
      value={{
        clickedRestaurant,
        isAddModalOpen,
        handleRestaurantClick,
        handleDetailModalClose,
        handleAddModalOpen,
        handleAddModalClose,
        handleFormSubmit,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useRestaurantContext } from "./RestaurantContext";

const ModalContext = createContext();

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

export function useModalContext() {
  return useContext(ModalContext);
}

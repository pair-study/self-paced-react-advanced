import { useContext } from "react";
import { RestaurantContext } from "./RestaurantContext";

export function useRestaurantContext() {
  const context = useContext(RestaurantContext);

  if (context === null) {
    throw new Error(
      "useRestaurantContext는 RestaurantProvider 내부에서만 사용할 수 있습니다.",
    );
  }

  return context;
}

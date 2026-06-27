import { useContext } from "react";
import { RestaurantsContext } from "./RestaurantsContext";

export function useRestaurantsContext() {
  const context = useContext(RestaurantsContext);
  if (context === null)
    throw new Error("RestaurantsProvider 내부에서만 사용할 수 있습니다.");
  return context;
}

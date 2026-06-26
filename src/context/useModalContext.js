import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export function useModalContext() {
  return useContext(ModalContext);
}

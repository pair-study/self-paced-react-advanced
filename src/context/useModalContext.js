import { useContext } from "react";
import { ModalContext } from "./ModalContext";

export function useModalContext() {
  const context = useContext(ModalContext);

  if (context === null) {
    throw new Error(
      "useModalContext는 ModalProvider 내부에서만 사용할 수 있습니다.",
    );
  }

  return context;
}

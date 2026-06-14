import { useEffect } from "react";
import styles from "./Modal.module.css";

export default function Modal({ children, title, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div className={styles.modal__backdrop} onClick={onClose}></div>
      <div className={styles.modal__container}>
        <h2 className={`${styles.modal__title} text-title`}>{title}</h2>
        {children}
      </div>
    </>
  );
}

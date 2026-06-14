import styles from "./RestaurantDetailModal.module.css";
import Modal from "../Modal/Modal.jsx";

export default function RestaurantDetailModal({ restaurant, onClose }) {
  return (
    <Modal title={restaurant.name} onClose={onClose}>
      <div className={styles.modal__restaurantInfo}>
        <p className="text-body">{restaurant.description}</p>
      </div>
      <div className={styles.modal__buttonContainer}>
        <button
          className={`${styles.button} ${styles["button--primary"]} text-caption`}
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </Modal>
  );
}

import styles from "./Modal.module.css";
import Modal from "./Modal";

export default function RestaurantDetailModal({ clickedRestaurant, onClose }) {
  return (
    <Modal title={clickedRestaurant.name} onClose={onClose}>
      <div className={styles["modal__restaurant-info"]}>
        <p className="text-body">{clickedRestaurant.description}</p>
      </div>
      {/* 닫기 버튼 */}
      <div className={styles["modal__button-container"]}>
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

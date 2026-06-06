import styles from "./RestaurantDetailModal.module.css";

export default function RestaurantDetailModal({ restaurant, onClose }) {
  return (
    <div className={`${styles.modal} ${styles["modal--open"]}`}>
      <div className={styles.modal__backdrop} onClick={onClose}></div>
      <div className={styles.modal__container}>
        <h2 className={`${styles.modal__title} text-title`}>
          {restaurant.name}
        </h2>
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
      </div>
    </div>
  );
}

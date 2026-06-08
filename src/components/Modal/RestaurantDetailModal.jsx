import styles from "./Modal.module.css";

export default function RestaurantDetailModal({ clickedRestaurant, onClose }) {
  return (
    <div className={`${styles.modal} ${styles["modal--open"]}`}>
      <div className={styles.modal__backdrop} onClick={onClose}></div>
      <div className={styles.modal__container}>
        <h2 className={`${styles.modal__title} text-title`}>
          {clickedRestaurant.name}
        </h2>
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
      </div>
    </div>
  );
}

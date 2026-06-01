import styles from "./RestaurantDetailModal.module.css";

export default function RestaurantDetailModal() {
  return (
    <div className={`${styles.modal} ${styles["modal--open"]}`}>
      <div className={styles["modal-backdrop"]}></div>
      <div className={styles["modal-container"]}>
        <h2 className={`${styles["modal-title"]} text-title`}>음식점 이름</h2>
        <div className={styles["restaurant-info"]}>
          <p className="text-body">음식점 소개 문구</p>
        </div>
        <div className={styles["button-container"]}>
          <button
            className={`${styles.button} ${styles["button--primary"]} text-caption`}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

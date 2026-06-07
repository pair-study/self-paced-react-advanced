import styles from "./Modal.module.css";

export default function RestaurantDetailModal() {
  return (
    <div className={`${styles.modal} ${styles["modal--open"]}`}>
      <div className={styles.modal__backdrop}></div>
      <div className={styles.modal__container}>
        <h2 className={`${styles.modal__title} text-title`}>음식점 이름</h2>
        <div className={styles["modal__restaurant-info"]}>
          <p className="text-body">
            음식점 소개 문구
          </p>
        </div>
        {/* 닫기 버튼 */}
        <div className={styles["modal__button-container"]}>
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

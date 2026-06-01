import styles from "./AddRestaurantModal.module.css";

export default function AddRestaurantModal() {
  return (
    <div className={`${styles.modal} ${styles["modal--open"]}`}>
      <div className={styles["modal-backdrop"]}></div>
      <div className={styles["modal-container"]}>
        <h2 className={`${styles["modal-title"]} text-title`}>새로운 음식점</h2>
        <form>
          <div
            className={`${styles["form-item"]} ${styles["form-item--required"]}`}
          >
            <label htmlFor="category" className="text-caption">
              카테고리
            </label>
            <select name="category" id="category" required>
              <option value="">선택해 주세요</option>
              <option value="한식">한식</option>
              <option value="중식">중식</option>
              <option value="일식">일식</option>
              <option value="양식">양식</option>
              <option value="아시안">아시안</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div
            className={`${styles["form-item"]} ${styles["form-item--required"]}`}
          >
            <label htmlFor="name" className="text-caption">
              이름
            </label>
            <input type="text" name="name" id="name" required />
          </div>

          <div className={styles["form-item"]}>
            <label htmlFor="description" className="text-caption">
              설명
            </label>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="5"
            ></textarea>
            <span className={`${styles["help-text"]} text-caption`}>
              메뉴 등 추가 정보를 입력해 주세요.
            </span>
          </div>

          <div className={styles["button-container"]}>
            <button
              className={`${styles.button} ${styles["button--primary"]} text-caption`}
            >
              추가하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

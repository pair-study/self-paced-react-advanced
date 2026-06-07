import { useState } from "react";
import styles from "./AddRestaurantModal.module.css";

export default function AddRestaurantModal({ onSubmit, onClose }) {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ category, name, description });
  }

  return (
    <div className={`${styles.modal} ${styles["modal--open"]}`}>
      <div className={styles.modal__backdrop} onClick={onClose}></div>
      <div className={styles.modal__container}>
        <h2 className={`${styles.modal__title} text-title`}>새로운 음식점</h2>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.formItem} ${styles["formItem--required"]}`}>
            <label htmlFor="category" className="text-caption">
              카테고리
            </label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">선택해 주세요</option>
              <option value="한식">한식</option>
              <option value="중식">중식</option>
              <option value="일식">일식</option>
              <option value="양식">양식</option>
              <option value="아시안">아시안</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div className={`${styles.formItem} ${styles["formItem--required"]}`}>
            <label htmlFor="name" className="text-caption">
              이름
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formItem}>
            <label htmlFor="description" className="text-caption">
              설명
            </label>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <span className={`${styles.formItem__helpText} text-caption`}>
              메뉴 등 추가 정보를 입력해 주세요.
            </span>
          </div>

          <div className={styles.modal__buttonContainer}>
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

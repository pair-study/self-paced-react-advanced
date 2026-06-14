import { useState } from "react";
import styles from "./AddRestaurantModal.module.css";
import Modal from "../Modal/Modal.jsx";
import { CATEGORIES } from "../../constants/categories.js";

export default function AddRestaurantModal({ onSubmit, onClose }) {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit({ category, name, description });
  }

  return (
    <Modal title="새로운 음식점" onClose={onClose}>
      <form onSubmit={handleFormSubmit}>
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
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
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
    </Modal>
  );
}

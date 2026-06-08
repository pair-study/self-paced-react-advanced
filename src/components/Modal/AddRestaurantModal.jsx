import modalStyles from "./Modal.module.css";
import formStyles from "./AddRestaurantModal.module.css";
import { CATEGORIES } from "../../constants/categories";
import { useState } from "react";
import Modal from "./Modal";

export default function AddRestaurantModal({ onSubmit, onClose }) {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ id: crypto.randomUUID(), category, name, description });
  };

  return (
    <Modal title="새로운 음식점" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {/* 카테고리 */}
        <div
          className={`${formStyles["form-item"]} ${formStyles["form-item--required"]}`}
        >
          <label htmlFor="category" className="text-caption">
            카테고리
          </label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            required
          >
            <option value="">선택해 주세요</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {/* 음식점 이름 */}
        <div
          className={`${formStyles["form-item"]} ${formStyles["form-item--required"]}`}
        >
          <label htmlFor="name" className="text-caption">
            이름
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        {/* 설명 */}
        <div className={formStyles["form-item"]}>
          <label htmlFor="description" className="text-caption">
            설명
          </label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="5"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></textarea>
          <span
            className={`${formStyles["form-item__help-text"]} text-caption`}
          >
            메뉴 등 추가 정보를 입력해 주세요.
          </span>
        </div>
        {/* 추가 버튼 */}
        <div className={modalStyles["modal__button-container"]}>
          <button
            className={`${modalStyles.button} ${modalStyles["button--primary"]} text-caption`}
          >
            추가하기
          </button>
        </div>
      </form>
    </Modal>
  );
}

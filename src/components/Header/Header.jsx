import styles from "./Header.module.css";
import addButton from "../../assets/add-button.png";

export default function Header({ onAddButtonClick }) {
  return (
    <header className={styles.gnb}>
      <h1 className={`${styles.gnb__title} text-title`}>점심 뭐 먹지</h1>
      <button
        type="button"
        className={styles.gnb__button}
        aria-label="음식점 추가"
        onClick={onAddButtonClick}
      >
        <img src={addButton} alt="음식점 추가" />
      </button>
    </header>
  );
}

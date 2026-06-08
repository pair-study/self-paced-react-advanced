import styles from "./Header.module.css";
import addButtonImg from "../../assets/add-button.png";

export default function Header({ onClick }) {
  return (
    <header className={styles.gnb}>
      <h1 className={`${styles.gnb__title} text-title`}>점심 뭐 먹지</h1>
      <button
        type="button"
        className={styles.gnb__button}
        aria-label="음식점 추가"
        onClick={onClick}
      >
        <img src={addButtonImg} alt="음식점 추가" />
      </button>
    </header>
  );
}

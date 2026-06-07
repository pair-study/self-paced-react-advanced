import styles from "./CategoryFilter.module.css";
import { FILTER_OPTIONS } from "../../constants/categories";

export default function CategoryFilter({ category, onChangeCategory }) {
  return (
    <section className={styles["restaurant-filter__container"]}>
      <select
        name="category"
        id="category-filter"
        className={styles["restaurant-filter"]}
        aria-label="음식점 카테고리 필터"
        value={category}
        onChange={onChangeCategory}
      >
        {FILTER_OPTIONS.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </section>
  );
}

import { CATEGORIES } from "../../constants/categories";
import styles from "./CategoryFilter.module.css";

export default function CategoryFilter({ category, onCategoryChange }) {
  return (
    <section className={styles.categoryFilter}>
      <select
        name="category"
        id="category-filter"
        className={styles.categoryFilter__select}
        aria-label="음식점 카테고리 필터"
        value={category}
        onChange={onCategoryChange}
      >
        <option value="전체">전체</option>
        {CATEGORIES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </section>
  );
}

import { ALL_CATEGORY, CATEGORIES } from "../constants/categories.js";
import styled from "styled-components";

const CategoryFilterSection = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-top: 24px;
`;

const CategorySelect = styled.select`
  height: 44px;
  min-width: 125px;
  border: 1px solid var(--grey-200);
  border-radius: 8px;
  background: transparent;
  font-size: 16px;
  padding: 8px;
`;

export default function CategoryFilter({ category, onCategoryChange }) {
  return (
    <CategoryFilterSection>
      <CategorySelect
        name="category"
        id="category-filter"
        aria-label="음식점 카테고리 필터"
        value={category}
        onChange={onCategoryChange}
      >
        <option value={ALL_CATEGORY}>{ALL_CATEGORY}</option>
        {CATEGORIES.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </CategorySelect>
    </CategoryFilterSection>
  );
}

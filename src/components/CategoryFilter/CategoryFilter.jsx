import { FILTER_OPTIONS } from "../../constants/categories";
import styled from "styled-components";
import { textBody } from "../../styles/typography";

export default function CategoryFilter({ category, onCategoryChange }) {
  return (
    <FilterContainer>
      <FilterSelect
        name="category"
        id="category-filter"
        aria-label="음식점 카테고리 필터"
        value={category}
        onChange={onCategoryChange}
      >
        {FILTER_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </FilterSelect>
    </FilterContainer>
  );
}

const FilterContainer = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-top: 24px;
`;

const FilterSelect = styled.select`
  height: 44px;
  min-width: 125px;
  border: 1px solid var(--grey-200);
  border-radius: 8px;
  background: transparent;
  ${textBody}
  padding: 8px;
`;

import { FILTER_OPTIONS } from "../../constants/categories";
import styled from "styled-components";
import { textBody } from "../../styles/typography";

const FilterContainer = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  margin-top: 24px;
`;

const FilterSelect = styled.select`
  height: 44px;
  min-width: 125px;
  border: 1px solid #d0d5dd;
  border-radius: 8px;
  background: transparent;
  ${textBody}
  padding: 8px;
`;

export default function CategoryFilter({ category, onChangeCategory }) {
  return (
    <FilterContainer>
      <FilterSelect
        name="category"
        id="category-filter"
        aria-label="음식점 카테고리 필터"
        value={category}
        onChange={onChangeCategory}
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

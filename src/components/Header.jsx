import styled from "styled-components";
import addButton from "../assets/add-button.png";

export default function Header({ onAddButtonClick }) {
  return (
    <Gnb>
      <GnbTitle>점심 뭐 먹지</GnbTitle>

      <GnbButton
        type="button"
        aria-label="음식점 추가"
        onClick={onAddButtonClick}
      >
        <img src={addButton} />
      </GnbButton>
    </Gnb>
  );
}

const Gnb = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  background-color: var(--primary-color);
`;

const GnbTitle = styled.h1`
  color: var(--grey-50);
  font-size: 20px;
  line-height: 24px;
  font-weight: 600;
`;

const GnbButton = styled.button`
  height: 40px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 24px;
  cursor: pointer;

  img {
    display: block;
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
`;

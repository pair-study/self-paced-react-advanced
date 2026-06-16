import addButtonImg from "../../assets/add-button.png";
import styled from "styled-components";
import { textTitle } from "../../styles/typography";

const Gnb = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 16px;
  background-color: var(--primary-color);
`;

const GnbTitle = styled.h1`
  ${textTitle}
  color: var(--grey-50);
`;

const GnbButton = styled.button`
  height: 40px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 24px;
  cursor: pointer;
`;

const GnbButtonImg = styled.img`
  display: block;
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

export default function Header({ onClick }) {
  return (
    <Gnb>
      <GnbTitle>점심 뭐 먹지</GnbTitle>
      <GnbButton type="button" aria-label="음식점 추가" onClick={onClick}>
        <GnbButtonImg src={addButtonImg} alt="" />
      </GnbButton>
    </Gnb>
  );
}

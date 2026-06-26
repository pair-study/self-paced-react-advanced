import { CATEGORIES } from "../../constants/categories";
import { useState } from "react";
import Modal from "./Modal";
import styled from "styled-components";
import { textCaption } from "../../styles/typography";
import { useModalContext } from "../../context/useModalContext";

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 36px;

  label {
    color: var(--grey-400);
    ${textCaption}
  }

  input,
  select,
  textarea {
    padding: 8px;
    margin: 6px 0;
    border: 1px solid var(--grey-200);
    border-radius: 8px;
    font-size: 16px;
  }

  textarea {
    resize: none;
  }

  select {
    height: 44px;
    color: var(--grey-300);
  }

  input[name="name"] {
    height: 44px;
  }

  ${(props) =>
    props.$required &&
    `label::after {padding-left: 4px;
  color: var(--primary-color);
  content: "*";}`}
`;

const FormHelpText = styled.span`
  color: var(--grey-300);
  ${textCaption}
`;

const ModalButtonContainer = styled.div`
  display: flex;
`;

const Button = styled.button`
  width: 100%;
  height: 44px;
  margin-right: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  ${(props) =>
    props.$primary &&
    `
    background: var(--primary-color);
    color: var(--grey-100);
  `}

  &:last-child {
    margin-right: 0;
  }

  ${textCaption}
`;

export default function AddRestaurantModal() {
  const { handleFormSubmit: onSubmit, handleAddModalClose: onClose } = useModalContext();
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
        <FormItem $required>
          <label htmlFor="category">카테고리</label>
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
        </FormItem>
        {/* 음식점 이름 */}
        <FormItem $required>
          <label htmlFor="name">이름</label>
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
        </FormItem>
        {/* 설명 */}
        <FormItem>
          <label htmlFor="description">설명</label>
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
          <FormHelpText>메뉴 등 추가 정보를 입력해 주세요.</FormHelpText>
        </FormItem>
        {/* 추가 버튼 */}
        <ModalButtonContainer>
          <Button $primary>추가하기</Button>
        </ModalButtonContainer>
      </form>
    </Modal>
  );
}

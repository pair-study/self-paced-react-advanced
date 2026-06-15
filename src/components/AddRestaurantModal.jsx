import { useState } from "react";
import Modal from "./Modal.jsx";
import { CATEGORIES } from "../constants/categories.js";
import styled from "styled-components";

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 36px;

  label {
    color: var(--grey-400);
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
  }

  select {
    padding: 8px;
    margin: 6px 0;
    border: 1px solid var(--grey-200);
    border-radius: 8px;
    font-size: 16px;
    height: 44px;
    color: var(--grey-300);
  }

  input {
    padding: 8px;
    margin: 6px 0;
    border: 1px solid var(--grey-200);
    border-radius: 8px;
    font-size: 16px;
    height: 44px;
  }

  textarea {
    resize: none;
    padding: 8px;
    margin: 6px 0;
    border: 1px solid var(--grey-200);
    border-radius: 8px;
    font-size: 16px;
  }

  span {
    color: var(--grey-300);
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const RequiredFormItem = styled(FormItem)`
  label::after {
    padding-left: 4px;
    color: var(--primary-color);
    content: "*";
  }
`;

const Button = styled.button`
  width: 100%;
  height: 44px;
  margin-right: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: var(--primary-color);
  color: var(--grey-100);
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
`;

export default function AddRestaurantModal({ onSubmit, onClose }) {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleFormSubmit(e) {
    e.preventDefault();
    onSubmit({ category, name, description });
  }

  return (
    <Modal title="새로운 음식점" onClose={onClose}>
      <form onSubmit={handleFormSubmit}>
        <RequiredFormItem>
          <label htmlFor="category">카테고리</label>
          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">선택해 주세요</option>
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </RequiredFormItem>

        <RequiredFormItem>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </RequiredFormItem>

        <FormItem>
          <label htmlFor="description">설명</label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <span>메뉴 등 추가 정보를 입력해 주세요.</span>
        </FormItem>

        <ButtonContainer>
          <Button>추가하기</Button>
        </ButtonContainer>
      </form>
    </Modal>
  );
}

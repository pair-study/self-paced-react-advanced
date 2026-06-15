import styled from "styled-components";
import Modal from "./Modal.jsx";
const RestaurantInfo = styled.div`
  margin-bottom: 24px;
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
`;

const ButtonContainer = styled.div`
  display: flex;
`;

const Button = styled.button`
  width: 100%;
  height: 44px;
  margin-right: 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  background: var(--primary-color);
  color: var(--grey-100);
  font-size: 14px;
  line-height: 20px;
`;

export default function RestaurantDetailModal({ restaurant, onClose }) {
  return (
    <Modal title={restaurant.name} onClose={onClose}>
      <RestaurantInfo>
        <Description>{restaurant.description}</Description>
      </RestaurantInfo>
      <ButtonContainer>
        <Button onClick={onClose}>닫기</Button>
      </ButtonContainer>
    </Modal>
  );
}

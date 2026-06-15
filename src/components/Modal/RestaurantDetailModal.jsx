import Modal from "./Modal";
import styled from "styled-components";

const ModalInfo = styled.div`
  margin-bottom: 24px;
`;

const ModalButtonContainer = styled.div`
  display: flex;
`;

const TextBody = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
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

  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
`;

export default function RestaurantDetailModal({ clickedRestaurant, onClose }) {
  return (
    <Modal title={clickedRestaurant.name} onClose={onClose}>
      <ModalInfo>
        <TextBody>{clickedRestaurant.description}</TextBody>
      </ModalInfo>
      {/* 닫기 버튼 */}
      <ModalButtonContainer>
        <Button $primary onClick={onClose}>
          닫기
        </Button>
      </ModalButtonContainer>
    </Modal>
  );
}

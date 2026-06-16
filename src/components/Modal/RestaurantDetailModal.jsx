import Modal, { Button, ModalButtonContainer } from "./Modal";
import styled from "styled-components";
import { textBody } from "../../styles/typography";

const ModalInfo = styled.div`
  margin-bottom: 24px;
`;

const TextBody = styled.p`
  ${textBody}
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

import { useEffect, useId } from "react";
import styled from "styled-components";
import { textTitle, textCaption } from "../../styles/typography";

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.35);
`;

const ModalContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 32px 16px;
  border-radius: 8px 8px 0px 0px;
  background: var(--grey-100);
`;

const ModalTitle = styled.h2`
  margin-bottom: 36px;
  ${textTitle}
`;

export const ModalButtonContainer = styled.div`
  display: flex;
`;

export const Button = styled.button`
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

export default function Modal({ title, onClose, children }) {
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <ModalBackdrop onClick={onClose} />
      <ModalContainer role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <ModalTitle id={titleId}>{title}</ModalTitle>
        {children}
      </ModalContainer>
    </>
  );
}

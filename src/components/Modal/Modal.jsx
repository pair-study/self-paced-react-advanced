import modalStyles from "./Modal.module.css";

export default function Modal({ title, onClose, children }) {
  return (
    <>
      <div className={modalStyles.modal__backdrop} onClick={onClose}></div>
      <div className={modalStyles.modal__container}>
        <h2 className={`${modalStyles.modal__title} text-title`}>{title}</h2>
        {children}
      </div>
    </>
  );
}

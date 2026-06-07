import styles from "./Modal.module.css";

export default function Modal({ children, title, onClose }) {
  return (
    <>
      <div className={styles.modal__backdrop} onClick={onClose}></div>
      <div className={styles.modal__container}>
        <h2 className={`${styles.modal__title} text-title`}>{title}</h2>
        {children}
      </div>
    </>
  );
}

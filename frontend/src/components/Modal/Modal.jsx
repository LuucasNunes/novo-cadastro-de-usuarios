// Modal.js
import React from "react";
import "./Modal.css";

function Modal({ isOpen, onClose, message, status }) {
  if (!isOpen) return null;

  const modalClass =
    status === "error"
      ? "modal-content modal-error"
      : "modal-content modal-success";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={modalClass}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Modal;

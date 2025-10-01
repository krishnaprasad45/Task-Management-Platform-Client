import React from "react";
import "./ConfirmPopup.css";

interface ConfirmPopupProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  visible,
  message,
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "Cancel",
  loading = false,
}) => {
  if (!visible) return null;

  return (
    <div className="confirmOverlay">
      <div className="confirmBox">
        <p>{message}</p>
        <div className="confirmActions">
          <button className="btn cancelBtn" onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button className="btn confirmBtn" onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;

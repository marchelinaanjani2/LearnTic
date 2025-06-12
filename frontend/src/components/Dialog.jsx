import * as React from "react";

const Dialog = ({ children, isOpen, onClose }) => {
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-96">
          {children}
          <button onClick={onClose} className="mt-4 text-red-500">
            Close
          </button>
        </div>
      </div>
    )
  );
};

export const DialogContent = ({ children }) => <div>{children}</div>;
export const DialogHeader = ({ children }) => <h2 className="text-lg font-bold">{children}</h2>;
export const DialogTitle = ({ children }) => <h3 className="text-md font-semibold">{children}</h3>;
export const DialogFooter = ({ children }) => <div className="mt-4">{children}</div>;

export default Dialog;

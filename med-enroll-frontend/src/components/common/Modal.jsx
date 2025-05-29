const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
    <div className="bg-white p-6 rounded shadow-md relative w-full max-w-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 text-xl"
        aria-label="Close"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);
export default Modal;

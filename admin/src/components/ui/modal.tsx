
export const Modal = ({ open, onClose, title, children,className }:any) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={`bg-[#202020] text-white rounded-lg p-6 w-full max-w-md shadow-xl relative ${className}`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-white hover:text-red-500 text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

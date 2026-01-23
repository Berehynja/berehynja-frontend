interface AddEventProps {
  onClick: () => void;
}

export function AddEvent({ onClick }: AddEventProps) {
  return (
    <button
      onClick={onClick}
      className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400 transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-500"
    >
      <div className="mb-2 text-6xl transition-transform duration-300 group-hover:scale-110">+</div>
      <span className="text-lg font-bold">Додати програму</span>
    </button>
  );
}

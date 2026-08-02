interface AddEventProps {
  onClick: () => void;
  label?: string;
}

export function AddEvent({ onClick, label = "Додати" }: AddEventProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-4xl border-2 border-dashed border-gray-300 bg-gray-50 p-7 text-center text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 hover:shadow-[0_14px_35px_rgba(37,99,235,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white text-5xl leading-none font-light shadow-sm transition-transform duration-300 group-hover:scale-110">
        +
      </span>
      <span className="text-lg font-bold">{label}</span>
    </button>
  );
}

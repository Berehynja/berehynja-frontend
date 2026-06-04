import { Pencil } from "lucide-react";
import React from "react";

interface EditButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  size?: number; // Розмір кнопки (h і w)
  className?: string;
}

const EditButton = ({
  onClick,
  size = 48, // Стандартний розмір 48px (h-12)
  className = "",
  ...props
}: EditButtonProps) => {
  // Рахуємо розмір іконки як 50% від розміру кнопки (або фіксований мінімум)
  const iconSize = Math.max(16, size * 0.5);

  return (
    <button
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      // Використовуємо style для точного задання розмірів,
      // якщо ви не хочете підтримувати десятки варіантів h- і w- класів
      style={{ width: size, height: size }}
      className={`absolute z-20 flex cursor-pointer items-center justify-center rounded-full transition-all duration-300 ${className}`}
    >
      <Pencil size={iconSize} />
    </button>
  );
};

export default EditButton;

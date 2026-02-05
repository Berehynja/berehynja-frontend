import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = isLoading || disabled;

  const baseStyles =
    "flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-bold transition-all curpsor-pointer";

  const disabledStyles = "bg-gray-200 text-gray-400 shadow-none transform-none hover:shadow-none";
  // Стилі для різних варіантів
  const variants = {
    primary:
      "bg-blue-500 text-white shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:cursor-pointer hover:-translate-y-0.5 active:translate-y-0 ",
    secondary: "text-gray-600 hover:bg-gray-200 hover:cursor-pointer",
    danger: "text-red-500 hover:bg-red-50 hover:text-red-600",
  };

  return (
    <button
      className={`${baseStyles} ${isDisabled ? disabledStyles : variants[variant]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? "Зачекайте..." : children}
    </button>
  );
}

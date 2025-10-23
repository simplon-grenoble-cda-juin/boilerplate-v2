import "./button.scss"
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  highlight?: boolean;
}

export const Button = ({
  children,
  className,
  variant = "default",
  highlight = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={clsx(
        "button",
        className,
        {
          "button--highlight": highlight,
        },
        {
          "button--ghost": variant === "ghost",
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
};
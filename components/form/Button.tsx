import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "blank" | "filled" | "ghost";
  error?: boolean;
}

const overrides = "focus:ring-0 focus:outline-none appearance-none";

const styles: { [key: string]: { [key: string]: string } } = {
  default: {
    style:
      "text-white bg-indigo-500 rounded-full py-1 px-6 hover:filter hover:brightness-90 transition",
    error: "border border-red-500 flex items-center gap-2 justify-center",
    disabled: "filter brightness-50"
  },
  ghost: {
    style:
      "text-white bg-white-500 rounded-full py-1 px-6 hover:filter hover:brightness-90 transition",
    error: "border border-red-500 flex items-center gap-2 justify-center",
    disabled: "filter brightness-50"
  },
  blank: {
    style: "",
    error: ""
  }
};

const Button = (props: ButtonProps) => {
  const { variant = "default" } = props;
  const className = `${props.className} ${overrides} ${styles[variant].style} ${
    props?.error && styles[variant].error
  } ${props?.disabled && styles[variant].disabled}`;
  return (
    <button {...props} className={className} type={props.type ?? "button"}>
      {props.children}
    </button>
  );
};

export default Button;

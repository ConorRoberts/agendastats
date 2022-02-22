import React, { useState } from "react";
import { BsChevronDown as ArrowDown } from "react-icons/bs";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: "default" | "disabled";
  disabled?: boolean;
}

const styles: { [key: string]: string } = {
  default:
    "pr-8 focus:border-indigo-300 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 rounded-md w-full border border-gray-300 dark:border-gray-700 py-2 px-2",
  disabled: "filter brightness-50"
};
const Select = (props: SelectProps) => {
  const [open, setOpen] = useState(false);

  const overrides = "appearance-none focus:ring-0 focus:outline-none";

  return (
    <div
      className={`relative flex items-center ${
        props.disabled && styles.disabled
      }`}
    >
      <select
        {...props}
        onClick={(e) => {
          if (props.onClick) props?.onClick(e);
          setOpen(!open);
        }}
        onBlur={(e) => {
          if (props.onBlur) props?.onBlur(e);
          if (open) setOpen(!open);
        }}
        className={`w-full ${styles.default} ${overrides} flex-1 py-1 px-1`}
      >
        {props.children}
      </select>
      <div
        className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform duration-75 ${
          open && "rotate-180"
        }`}
      >
        <ArrowDown className="text-lg" />
      </div>
    </div>
  );
};

export default Select;

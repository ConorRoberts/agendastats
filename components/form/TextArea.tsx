import React, { ForwardedRef, forwardRef } from "react";
import { styles, overrides } from "./InputStyles";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "blank" | "file";
  error?: boolean;
}

const TextArea = forwardRef((props: TextAreaProps, ref: ForwardedRef<any>) => {
  const { variant = "default" } = props;
  const className = `${props.className} ${overrides} ${styles[variant].style} ${props?.error && styles[variant].error} ${props?.disabled && styles[variant].disabled}`;

  return (
    <textarea
      {...props}
      className={className}
      ref={ref}
    />
  );
});

TextArea.displayName = "TextArea";

export default TextArea;
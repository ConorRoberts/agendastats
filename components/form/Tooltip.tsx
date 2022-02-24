import React, { useState } from "react";
import { Question } from "@components/Icons";
import { Modal } from ".";

export interface TooltipProps {
  text: string;
}

const Tooltip = ({ text }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative inline-block p-1"
      onClick={() => setVisible(true)}
      // onMouseLeave={() => setVisible(false)}
    >
      <Question className="w-5 h-5 text-black" />
      {visible && (
        <Modal onClose={() => setVisible(false)}>
          {/* <div className="absolute top-0 right-0 p-2 rounded-md dark:bg-gray-800 bg-white dark:text-gray-100 bg-opacity-95 border dark:border-gray-600 border-gray-200 w-48 font-medium shadow-md z-10"> */}
          {text}
        </Modal>
      )}
    </div>
  );
};

export default Tooltip;

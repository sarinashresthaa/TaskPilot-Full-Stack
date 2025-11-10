import React from "react";

const Button = (props) => {
  return (
    <div>
      <button
        className="cursor-pointer flex items-center gap-1 border-1 px-5 py-2 text-white bg-[#7D3BEC] rounded-md"
        onClick={props.onClick}
      >
        {props.icon}
        {props.label}
      </button>
    </div>
  );
};

export default Button;

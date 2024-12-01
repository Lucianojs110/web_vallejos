import React from "react";
import "./CheckBox.css";
const CheckBox = ({
  isChecked,
  setChecked,
}: {
  isChecked: boolean;
  setChecked: CallableFunction;
}) => {
  return (
    <>
      <label className="switch">
        <input
          type="checkbox"
          checked={isChecked}
          onClick={() => setChecked(!isChecked)}
        />
        <span className="slider round"></span>
      </label>
    </>
  );
};

export default CheckBox;

import { setStep } from "../../stores/checkout";
import React from "react";

const NextButton = ({ step, onClick }: { step: number; onClick: Function }) => {
  return (
    <div
      className={`relative hover:cursor-pointer p-3 w-full bg-[#2196F3] rounded text-center `}
      onClick={() => {
        setStep(step);
        if (onClick) {
          onClick();

          setTimeout(function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }, 100);
        }
      }}
    >
      <span className={`w-full text-white text-md font-semibold`}>
        Continuar
      </span>
    </div>
  );
};

export default NextButton;

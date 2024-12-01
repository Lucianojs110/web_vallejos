import React from "react";
import { openModal } from "../utils/modals";

const ButtonOpenMenu = ({ children }: { children: any }) => {
  return (
    <div onClick={() => openModal("menu")} className={`hover:cursor-pointer`}>
      {children}
    </div>
  );
};

export default ButtonOpenMenu;

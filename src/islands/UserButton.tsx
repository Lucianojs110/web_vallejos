import React from "react";
import LoginForm from "./LoginForm";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { decodeJWT } from "../utils";
import { logout } from "../services";

export default function UserButton({ token }: { token?: string | null }) {
  const [user, _] = React.useState<any>(() =>
    token ? decodeJWT(token) : null
  );

  if (!user)
    return (
      <>
        <LoginForm />
      </>
    );

  return (
    <Dropdown>
      <DropdownTrigger>
        <div
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 cursor-pointer"
        >
          <img
            src="/images/account-circle.svg"
            alt="Usuario"
            className="w-4 h-4 mr-2"
          />
          <span className="text-sm font-semibold">Mi Cuenta</span>
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions">
        <DropdownItem
          key="logout"
          onClick={async () => {
            await logout();
            window.location.reload();
          }}
        >
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

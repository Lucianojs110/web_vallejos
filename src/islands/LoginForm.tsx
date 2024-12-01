"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";
import AccountIcon from "../icons/AccountIcon";
import MailIcon from "../icons/MailIcon";
import LockIcon from "../icons/LockIcon";

export default function LoginFormIsland() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  return (
    <>
      <AccountIcon onPress={onOpen} />

      <LoginModal
        {...{ isOpen, onOpenChange, setLoading, setError, loading, error }}
      />
    </>
  );
}
export const LoginModal = ({
  isOpen,
  onOpenChange,
  setLoading,
  setError,
  loading,
  error,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  error: string;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
            <form
              onSubmit={async (e) => {
                try {
                  e.preventDefault();

                  setLoading(true);
                  setError("");
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const response = await fetch("/api/login", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await response.json();

                  onClose();
                  window.location.reload();
                } catch (err) {
                  console.log(err);
                  setError("Usuario o contraseña incorrectos");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <ModalBody>
                <Input
                  autoFocus
                  endContent={<MailIcon />}
                  label="Email"
                  placeholder="Enter your email"
                  variant="bordered"
                  name="email"
                />
                <Input
                  endContent={<LockIcon />}
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                  name="password"
                />
                <div className="flex py-2 px-1 justify-between">
                  <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Recordarme
                  </Checkbox>
                  <Link color="primary" href="#" size="sm">
                    Olvidaste la contraseña?
                  </Link>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  type="submit"
                  className="shadow-lg w-full text-lg"
                  disabled={loading}
                >
                  Ingresar
                </Button>
              </ModalFooter>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <br />
              <ModalFooter className="border-t-2 ">
                <Button
                  className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg w-full text-lg"
                  onPress={onClose}
                >
                  Registrarme
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ScrollShadow,
} from "@nextui-org/react";
import { NavigationMenuElement } from "./SideNavigationBar";
import FilterIcon from "../icons/FilterIcon";
import type { INavigationMenu } from "../types/ICatalog";

export default function ModalFilters({
  menu,
  line,
  search,
}: {
  menu: INavigationMenu;
  line: string;
  search: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        startContent={<FilterIcon />}
        className={`flex flex-row gap-2 items-center px-4 py-2 bg-white rounded-md flex-1 justify-center`}
      >
        Filtrar
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {menu.count} resultados
              </ModalHeader>
              <ModalBody key={"closeFiltersMobile"} onClick={() => onclose()}>
                {menu?.elements?.map((element) => (
                  <NavigationMenuElement
                    key={element.id}
                    element={element}
                    line={line}
                    search={search}
                  />
                ))}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

import React from "react";
import { sortListOptions } from "./../utils/sortsUtils";
import SortOption from "./SortOption";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import SortIcon from "../icons/SortIcon";

export default function ModalSort({
  pathname,
  search,
  sortby,
}: {
  pathname: string;
  search: string;
  sortby: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        onPress={onOpen}
        endContent={<SortIcon />}
        className={`flex flex-row gap-2 items-center px-4 py-2 bg-white rounded-md flex-1 justify-center`}
      >
        Ordenar por
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Ordenar por...
              </ModalHeader>
              <ModalBody onClick={() => onclose()}>
                {sortListOptions.map((sortbyOption) => (
                  <SortOption
                    pathname={pathname}
                    search={search}
                    sortby={sortbyOption}
                    currentSort={sortbyOption === sortby}
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

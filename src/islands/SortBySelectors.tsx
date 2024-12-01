import { getLabel, sortListOptions } from "./../utils/sortsUtils";
import {
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import SortOption from "./SortOption";
import ChevronDownIcon from "../icons/ChevronDownIcon";
import React from "react";

export default function SortBySelectors({
  pathname,
  search,
  sortby,
}: {
  pathname: string;
  sortby: string;
  search: string;
}) {
  return (
    <div className={`flex justify-end px-2 hidden md:flex w-full`}>
      <div className={`relative flex items-center gap-1`}>
        <label className={`font-light px-2`}>Ordenar por:</label>
        <Dropdown>
          <DropdownTrigger>
            <Button endContent={<ChevronDownIcon />}>{getLabel(sortby)}</Button>
          </DropdownTrigger>
          <DropdownMenu>
            {sortListOptions.map((sortbyOption) => (
              <DropdownItem key={sortbyOption}>
                <SortOption
                  pathname={pathname}
                  search={search}
                  sortby={sortbyOption}
                  currentSort={sortbyOption === sortby}
                />
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
}

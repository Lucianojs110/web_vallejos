import React from "react";
import { getLabel } from "../utils/sortsUtils";

export default function SortOption({
  pathname,
  search,
  sortby,
  currentSort,
}: {
  pathname: string;
  search: string;
  sortby: string;
  currentSort: boolean;
}) {
  return (
    <a
      className={`h-full flex items-center p-4 justify-between`}
      href={`${pathname}?search=${search}&sortby=${sortby}`}
    >
      <span className={`font-light`}>{getLabel(sortby)}</span>
      <i>
        <img
          src={currentSort ? "/images/check-circle.svg" : "/images/circle.svg"}
          alt="check"
          className={`w-5 h-5 text-blue-500`}
        />
      </i>
    </a>
  );
}

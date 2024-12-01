import React from "react";
import type { IDataCatalog } from "../types/ICatalog";
import ModalFilters from "./ModalFilters";
import ModalSort from "./ModalSort";

export default function ContentFiltersAndSortButtons({
  data,
}: {
  data: IDataCatalog;
}) {
  return (
    <div
      className={`flex flex-row gap-2 md:hidden w-full justify-between px-2`}
    >
      <ModalFilters
        {...{
          menu: data.results.menu,
          line: data.line,
          search: data.search,
          key: "modal filtros",
        }}
      />
      <ModalSort
        {...{
          pathname: data.pathname,
          search: data.search,
          sortby: data.sortby,
          key: "modal sort",
        }}
      />
    </div>
  );
}

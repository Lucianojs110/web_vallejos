import React from "react";
import { Pagination } from "@nextui-org/react";

interface IPagination {
  currentPage: number;
  totalPages: number;
  search: string;
  pathname: string;
}

const PaginationComponent = ({
  currentPage,
  totalPages,
  search,
  pathname,
 
}: IPagination) => {
  return (
    <div className="flex flex-row items-center justify-center gap-6 mx-auto my-10">
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        data-active-page={currentPage}
        data-total={totalPages - 1}
         color='warning'
        onChange={(page) => {
          window.location.href = `${pathname}?page=${page}&search=${search}`;
        }}
        
      />
    </div>
  );
};

export default PaginationComponent;

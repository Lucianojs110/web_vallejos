import React from "react";
import type {
  INavigationMenuElement,
  ISideNavigationBar,
} from "../types/INavigationBar";

const getUrl = (line: string, slug: string, search: string) => {
  let url = "";

  if (line.length) {
    url = `/${line}/${slug}`;
  } else {
    url = `/${slug}`;
  }
  if (search.length) {
    url = `${url}?search=${search}`;
  }

  return url;
};

export const NavigationMenuElement = ({
  element,
  line,
  search,
}: INavigationMenuElement) => {
  const url = getUrl(line || "", element?.slug || "", search || "");

  return (
    <div>
      <a href={url}>
        <div className={`flex flex-row gap-3 items-center`}>
          <img
            width={36}
            height={36}
            style={{ objectFit: "cover" }}
            src={element?.image}
            alt={element?.name}
          />
          <div className={`text-sm font-light`}>{element?.name}</div>
          <div className={`text-sm font-extralight`}>({element?.count})</div>
        </div>
      </a>
    </div>
  );
};

export default function SideNavigationBar({
  menu,
  line,
  search,
}: ISideNavigationBar) {
  return (
    <div className={`flex flex-col gap-4`}>
      <div className={`text-sm font-medium`}>{menu.count} resultados</div>
      {menu?.elements?.map((element) => (
        <NavigationMenuElement element={element} line={line} search={search} />
      ))}
    </div>
  );
}

export interface IMenuElement {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
}

export interface INavigationMenu {
  type: string;
  count: number;
  elements: IMenuElement[];
}

export interface INavigationMenuElement extends Record<string, any> {
  element?: IMenuElement;
  line?: string;
  search?: string;
}

export interface ISideNavigationBar {
  menu: INavigationMenu;
  line: string;
  search: string;
}

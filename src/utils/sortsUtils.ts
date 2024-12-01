export const sortListOptions = ["priority-desc", "price-asc", "price-desc"];

export const getLabel = (sortby: string) => {
  switch (sortby) {
    case "priority-desc":
      return "Recomendado";
    case "price-asc":
      return "Menor precio";
    case "price-desc":
      return "Mayor precio";
    default:
      return "Recomendado";
  }
};

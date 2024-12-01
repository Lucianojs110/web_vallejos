const formatter = new Intl.NumberFormat("es-AR");

export function formatCurrency(value: number) {
  return `$ ${formatter.format(Number(value.toFixed(2)))}`;
}

// format date time
export function formatDate(date: number) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  let minute = dateObj.getMinutes().toString();
  if (minute === "0") minute = "00";
  return `${month}/${day}/${year} ${dateObj.getHours()}:${minute}`;
}

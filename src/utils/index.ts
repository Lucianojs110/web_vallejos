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

export const decodeJWT = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace("-", "+").replace("_", "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

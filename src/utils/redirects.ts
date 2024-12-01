export const redirect = (status: number, location: string) => {
  const headers = new Headers({
    location,
  });
  return new Response(null, {
    status,
    headers,
  });
};

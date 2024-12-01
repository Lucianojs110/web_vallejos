import type { APIRoute } from "astro";

import { REFRESH_TOKEN_AUTH, TOKEN_AUTH } from "../../config/constants";

export const POST: APIRoute = async ({ request, cookies }) => {
  cookies.delete(TOKEN_AUTH);
  cookies.delete(REFRESH_TOKEN_AUTH);
  return new Response(
    JSON.stringify({
      message: "success",
    }),
    {
      status: 200,
      headers: {
        "Set-Cookie":
          "token-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    }
  );
};

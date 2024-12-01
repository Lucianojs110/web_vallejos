import type { APIRoute } from "astro";

import {
  API_ENDPOINT,
  REFRESH_TOKEN_AUTH,
  TOKEN_AUTH,
} from "../../config/constants";

export const POST: APIRoute = async ({ request, cookies }) => {
  const data = await request.formData();

  const email = data.get("email");
  const password = data.get("password");
  const resp = await fetch(`${API_ENDPOINT}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const apiResponse: any = await resp.json();

  cookies.set(TOKEN_AUTH, apiResponse.access_token, {
    path: "/",
  });
  cookies.set(REFRESH_TOKEN_AUTH, apiResponse.refresh_token, {
    path: "/",
  });

  return new Response(
    JSON.stringify({
      message: "success",
    }),
    { status: 200 }
  );
};

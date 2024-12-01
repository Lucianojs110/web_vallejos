import { defineMiddleware } from "astro:middleware";
import {
  API_ENDPOINT,
  REFRESH_TOKEN_AUTH,
  TOKEN_AUTH,
} from "../config/constants";
import { decodeJWT } from "../utils";

export const isExpiredToken = (jwt: string) => {
  const decoded = decodeJWT(jwt);
  if (new Date(decoded.exp * 1000) < new Date()) {
    return true;
  }
  return false;
};

const refreshTokenInvoke = async (refreshToken: string) => {
  try {
    const resp = await fetch(`${API_ENDPOINT}/refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        refresh_token: refreshToken,
      },
    });
    const apiResponse: any = await resp.json();

    if (apiResponse.access_token) {
      return {
        access_token: apiResponse.access_token,
      };
    }
    return { access_token: null };
  } catch (_) {
    return { access_token: null };
  }
};

export const onRequest = defineMiddleware(
  async ({ locals, request, cookies }, next) => {
    const token = cookies.get(TOKEN_AUTH);
    const refreshToken = cookies.get(REFRESH_TOKEN_AUTH);

    if (refreshToken?.value && token?.value && isExpiredToken(token.value)) {
      const access_token = await refreshTokenInvoke(refreshToken.value);
      if (access_token) {
        cookies.set(TOKEN_AUTH, access_token.access_token);
      } else {
        cookies.delete(TOKEN_AUTH);
        cookies.delete(REFRESH_TOKEN_AUTH);
      }
    }

    return next();
  }
);

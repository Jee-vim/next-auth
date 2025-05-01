import axios from "axios";
import { getServerSession } from "next-auth";
import { getSession, signOut } from "next-auth/react";

import { configs } from "../index";
import errorHandler from "./error-handler";
import auth from "@/lib/auth";

// async function refreshAccessToken(token: any) {
//   try {
//     const refreshedTokens: any = await Http.auth.refreshToken(
//       token.refresh_token,
//     );
//
//     return {
//       ...token,
//       accessToken: refreshedTokens.accessToken,
//       accessTokenExpires: Date.now() + refreshedTokens.expiresIn * 1000, // Set new expiration time
//       refresh_token: refreshedTokens.refreshToken || token.refreshToken, // Refresh token may stay the same
//     };
//   } catch (error) {
//     console.error("Failed to refresh access token", error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

export const Axios = axios.create({
  baseURL: configs.URL_API,
  headers: {
    "api-key": configs.API_KEY,
  },
});

Axios.interceptors.request.use(async (request) => {
  const sessionClient = await getSession();
  const sessionServer =
    typeof window === "undefined" ? await getServerSession(auth) : null;

  const token = sessionClient?.user.token || sessionServer?.user?.token;

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      await signOut();
      return Promise.reject(error);

      // originalRequest._retry = true;
      // try {
      //   const session: any = await getSession();
      //   const refreshToken = session?.refresh_token;
      //   if (refreshToken) {
      //     const newTokens = await refreshAccessToken(refreshToken);
      //     originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
      //     return Axios(originalRequest); // retry request
      //   }
      // } catch (refreshError) {
      //   signOut();
      //   return Promise.reject(refreshError);
      // }
    }

    return Promise.reject(errorHandler(error));
  },
);

export default Axios;

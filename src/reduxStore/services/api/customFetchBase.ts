import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import cookie from "../../../utils/cookie";
import { Mutex } from "async-mutex";
import { refreshTokenAsync, verifyTokenAsync } from "../../../utils/authRequests";

const mutex = new Mutex();

const baseUrl = import.meta.env.VITE_V2_API_URL;
console.log(baseUrl)
console.log(import.meta.env)

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    // By default, if we have a token in the store, let's use that for authenticated requests
    const token = cookie.get("jwt");
    if (token) {
      headers.set("authorization", `JWT ${token}`);
    }

    headers.set("Accept", "application/json");

    // Something weird here - when we have form data we need to set
    // a boundary on the content-type header. This happens automatically
    // if we delete the content type here
    if (headers.get("Content-Type")?.includes("form-data")) {
      headers.delete("Content-Type");
    } else {
      headers.set(
        "Content-Type",
        headers.get("Content-Type") || "application/json"
      );
    }
    return headers;
  }
});

const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((result.error?.data as any)?.code === "token_not_valid") {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      const jwtRefreshToken = cookie.get("jwt-refresh");
      try {
        if (jwtRefreshToken) {
          const verifyRefreshResponse = await verifyTokenAsync(jwtRefreshToken);
          if (verifyRefreshResponse.code) {
            cookie.delete("jwt");
            cookie.delete("jwt-refresh");
          } else {
            const jwtRefreshResponse = await refreshTokenAsync(jwtRefreshToken);
            const refreshedAccessCode = jwtRefreshResponse.access;
            const refreshedRefreshCode = jwtRefreshResponse.refresh;

            cookie.set("jwt", refreshedAccessCode, 1);
            cookie.set("jwt-refresh", refreshedRefreshCode, 72);
            result = await baseQuery(args, api, extraOptions);
          }
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } else if ((result.error?.data as any)?.code === "user_inactive") {
    cookie.delete("jwt");
    cookie.delete("jwt-refresh");
  }

  if (result.error) {
    console.log(result.error);
  }

  return result;
};

export default customFetchBase;

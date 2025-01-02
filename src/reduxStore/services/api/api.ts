import { createApi } from "@reduxjs/toolkit/query/react";

import customFetchBase from "./customFetchBase";

export type NormalizedData<T> = { ids: number[], byId: { [id: number]: T}}
export function normalizeData<T>(data: { id: number }[]): NormalizedData<T> {
  return {
    ids: data.map(({ id }) => id),
    byId: data.reduce(
      (prev, next) => ({
        ...prev,
        [next.id]: next
      }),
      {}
    )
  };
};

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: "api",
  tagTypes: [ "Board" ],
  endpoints: ()=> ({}),
  baseQuery: customFetchBase
});

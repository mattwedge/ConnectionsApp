import { api, normalizeData, NormalizedData } from "./api";

export type PublicUser = {
  username: string;
}

export type Tile = {
  id: number
  name: string
  group: number
}

export type Group = {
  id: number
  tiles: Tile[];
}

export type Board = {
  name: string;
  groups: Group[];
  id: number;
  created_by: PublicUser;
  created_at: string;
}

const extendedApi = api.injectEndpoints({
  endpoints: builder => ({
    getBoards: builder.query<NormalizedData<Board>, void>({
      query: body => ({
        url: "boards/",
        method: "GET",
        body,
        responseHandler: async response => {
          if (response.ok) {
            const responseJson = await response.json();
            return normalizeData<Board>(responseJson);
          }
          // Just return the error data
          return await response.json();
        }
      })
    })
  }),
  overrideExisting: true
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetBoardsQuery
} = extendedApi;

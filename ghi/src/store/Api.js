import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
    credentials: "include",
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    logIn: builder.mutation({
      query: (info) => {
        let formData = null;
        if (info instanceof HTMLElement) {
          formData = new FormData(info);
        } else {
          formData = new FormData();
          formData.append("username", info.username);
          formData.append("password", info.password);
        }
        return {
          url: "/login/",
          method: "post",
          body: formData,
        };
      },
      providesTags: ["Account"],
      invalidatesTags: (result) => {
        return (result && ["Token"]) || [];
      },
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/token",
        method: "delete",
      }),
      invalidatesTags: ["Account", "Token"],
    }),
    getGames: builder.query({
      query: () => ({
        url: 'api/games/list/',
      }),
      providesTags: ["Games"]
    }),
    getGameDetails: builder.query({
      query: (name) => ({
        url: `api/games/show/${name}`
      })
    }),
    getLeaderBoardByGame: builder.query({
      query: (name) => ({
        url: `/api/games/show/{${name}/`,
      }),
      providesTags: ["Leaderboard"]
    })
  })
})

export const {
  useLogInMutation,
  useGetGamesQuery,
  useGetGameDetailsQuery,
  useGetLeaderBoardByGameQuery,
} = apiSlice;

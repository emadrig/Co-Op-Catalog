import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token')
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    getToken: builder.mutation({
      query: (info) => ({
        url: "/api/token/",
        method: 'POST',
        body: info
      }),
      providesTags: ["Token"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/api/accounts/${id}/`
      }),
    }),
    createUser: builder.mutation({
      query: (info) => ({
        url: 'api/accounts/',
        method: 'POST',
        body: info,
      }),
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/api/token/",
        method: "DELETE",
      }),
      invalidatesTags: ["Account", "Token"],
    }),
    getGames: builder.query({
      query: () => ({
        url: 'games/',
      }),
      providesTags: ["Games"]
    }),
    getGameDetails: builder.query({
      query: (name) => ({
        url: `games/${name}/name/`
      })
    }),
    createGameRecord: builder.mutation({
      query: (body) => ({
        url: '/high-score/',
        method: "POST",
        body: body
      }), invalidatesTags: ["Leaderboard"]
    }),
    getLeaderBoardByGame: builder.query({
      query: (id) => ({
        url: `high-score/${id}/game/`,
      }),
      providesTags: ["Leaderboard"]
    })
  })
})

export const {
  useGetTokenMutation,
  useCreateUserMutation,
  useLogOutMutation,
  useGetGamesQuery,
  useGetGameDetailsQuery,
  useGetLeaderBoardByGameQuery,
  useCreateGameRecordMutation,
} = apiSlice;

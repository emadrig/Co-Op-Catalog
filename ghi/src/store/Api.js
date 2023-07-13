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
    logOut: builder.mutation({
      query: () => ({
        url: "/api/token/",
        method: "delete",
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
        url: '/gamerecords/',
        method: "POST",
        body: body
      })
    }),
    getLeaderBoardByGame: builder.query({
      query: (id) => ({
        url: `gamerecords/${id}/game/`,
      }),
      providesTags: ["Leaderboard"]
    })
  })
})

export const {
  useGetTokenMutation,
  useLogOutMutation,
  useGetGamesQuery,
  useGetGameDetailsQuery,
  useGetLeaderBoardByGameQuery,
  useCreateGameRecordMutation,
} = apiSlice;

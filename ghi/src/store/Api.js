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
      query: () => ({
        url: '/gamerecords/',
        method: "POST",
        body: {
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg3ODIxODE3LCJpYXQiOjE2ODc4MjAwMTcsImp0aSI6IjllOTM2YjZhYzI2NTRmOWE5NGFkZGM1NGIwZDUwNjY5IiwidXNlcl9pZCI6Mn0.A_LEKbzdAzj6SMiQmbjQiDUA0gMcrMdU5w54SisHNy0",
          "game": 1,
          "score": 1
        }
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
} = apiSlice;

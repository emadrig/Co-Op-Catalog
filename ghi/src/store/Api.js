import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
    // credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const selector = apiSlice.endpoints.getToken.select();
      const { data: tokenData } = selector(getState());
      if (tokenData && tokenData.access_token) {
        headers.set("Authorization", `Bearer ${tokenData.access_token}`);
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    getToken: builder.query({
      query: () => ({
        url: "/api/token/",
        credentials: "include",
        method: 'POST'
      }),
      providesTags: ["Token"],
    }),
    logIn: builder.mutation({
      query: (info) => {
        let formData = null;
        if (info instanceof HTMLElement) {
          formData = new FormData(info);
        } else {
          formData = {};
          formData["username"] = info.username
          formData["password"] = info.password
        }
        return {
          url: "api/accounts/login/",
          method: "post",
          body: formData,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      providesTags: ["Account"],
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
        url: 'games/',
      }),
      providesTags: ["Games"]
    }),
    getGameDetails: builder.query({
      query: (name) => ({
        url: `games/${name}/name/`
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
  useGetTokenQuery,
  useLogInMutation,
  useGetGamesQuery,
  useGetGameDetailsQuery,
  useGetLeaderBoardByGameQuery,
} = apiSlice;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000/",
        prepareHeader: (headers, {getState}) => {
            const selector = apiSlice.endpoints.getToken.select();
            const { data: tokenData } = selector(getState());
            if (tokenData && tokenData.access_token) {
                headers.set("Authorization", `Bearer ${tokenData.access_token}`);
            }
            return headers;
        }
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
                url: "/token",
                method: "post",
                body: formData,
                credentials: "include",
              };
            },
            providesTags: ["Account"],
            invalidatesTags: (result) => {
              return (result && ["Token"]) || [];
            },
          }),
    })
})

export const {
    useLogInMutation,
} = apiSlice;

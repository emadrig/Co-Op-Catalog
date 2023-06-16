import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearForm } from "./accountSlice";


export const apiSlice = createApi({
    reducerPath: "api",
    baseQueryPath: fetchBaseQuery({
        baseUrl: "http://localhost:8000/",
        prepareHeader: (headers, {getState}) => {
            const selector = apiSlice.endpoints.getToken.select();
        }
    })
})

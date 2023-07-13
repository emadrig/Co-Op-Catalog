import { configureStore} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./Api";
import tokenReducer from './tokenSlice';
import userReducer from './userSlice'

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        token: tokenReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(apiSlice.middleware);
    },
});

setupListeners(store.dispatch);

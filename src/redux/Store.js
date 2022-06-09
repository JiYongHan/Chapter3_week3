import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import PostSlice from "./modules/PostSlice";

const store = configureStore({
    reducer:{
        Post : PostSlice,
    },
});

export default store;
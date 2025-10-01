import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../slice/taskSlice";
import userReducer from "../slice/userSlice";

export const store = configureStore({
  reducer: {
    task: taskReducer,
    user: userReducer, // added user reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserSliceState } from "./store.types";
import { User } from "../main.types";

const initialState: UserSliceState = {
    user: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        resetUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;

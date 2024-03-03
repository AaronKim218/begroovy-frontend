import { createSlice } from "@reduxjs/toolkit";
import { UserSliceState } from "./store.types";

const initialState: UserSliceState = {
  user: {
    _id: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      Object.assign(state.user, action.payload);
    },
    resetUser: () => initialState,
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    _id: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
    spotifyId: '',
    __v: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
        Object.assign(state, action.payload);
    },
    resetUser: (state) => {
        Object.assign(state, initialState);
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
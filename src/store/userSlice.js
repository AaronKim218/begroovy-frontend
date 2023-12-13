import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    id: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
    spotifyId: '',
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
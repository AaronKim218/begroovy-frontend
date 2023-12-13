import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
        state = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
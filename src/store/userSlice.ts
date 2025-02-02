import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  email: string;
  phone: string;
  name: string;
  photo?: string;
  isAuthenticated?: boolean;
}

const initialState: UserState = {
  email: '',
  phone: '',
  name: '',
  photo: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser(state, action: PayloadAction<UserState>) {
      state.email = action.payload.email;
      state.photo = action.payload.photo;
      state.phone = action.payload.phone;
      state.name = action.payload.name;
    },
    setUserAuthentication(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { saveUser, setUserAuthentication } = userSlice.actions;

export default userSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  id?: string;
  email?: string;
  phone?: string;
  name: string;
  photo?: string;
  role?: "ADMIN" | "USER" | "CONTRACTOR" | "GOVERNMENT";
  isVerified?: boolean;
  isAuthenticated: boolean;
  designation?: string;
  department?: string;
  governmentId?: string;
  contractorLicense?: string;
  contributions?: number;
  experience?: number;
  reputationScore?: number;
}

const initialState: UserState = {
  name: "",
  email: "",
  phone: "",
  photo: "",
  isAuthenticated: false,
  isVerified: false,
  role: "USER",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser(state, action: PayloadAction<Partial<UserState>>) {
      console.log("{ ...state, ...action.payload }", {
        ...action.payload,
        ...state,
      });
      return { ...state, ...action.payload };
    },
    setUserAuthentication(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { saveUser, setUserAuthentication, clearUser } = userSlice.actions;

export default userSlice.reducer;

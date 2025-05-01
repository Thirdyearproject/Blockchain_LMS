import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("lmstoken")
    ? JSON.parse(localStorage.getItem("lmstoken"))
    : null,
  user: localStorage.getItem("lmsuser")
    ? JSON.parse(localStorage.getItem("lmsuser"))
    : null,
  type: localStorage.getItem("type")
    ? JSON.parse(localStorage.getItem("type"))
    : null,
  signupData: localStorage.getItem("registeredAccounts")
    ? JSON.parse(localStorage.getItem("registeredAccounts"))
    : null,
  signup: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload));
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    setType(state, action) {
      state.type = action.payload;
      localStorage.setItem("type", JSON.stringify(action.payload));
    },
    resetSignupData(state, action) {
      state.signupData = action.payload;
    },
    setSignupData(state, action) {
      state.signupData = { ...state.signupData, ...action.payload };
    },
    setSignup(state, action) {
      state.signup = action.payload;
    },
    setRegisteredAccounts(state, action) {
      state.signupData = action.payload;
    },
  },
});

export const {
  setSignupData,
  setSignup,
  resetSignupData,
  setToken,
  setUser,
  setType,
  setRegisteredAccounts,
} = authSlice.actions;
export default authSlice.reducer;

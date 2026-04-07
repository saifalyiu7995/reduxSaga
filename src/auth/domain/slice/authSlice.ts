// ============================================================
// AUTH SLICE — Redux state + actions for authentication
// ============================================================
// CLEAN ARCHITECTURE LAYER: Domain
//
// The slice lives in the domain layer because it defines BUSINESS RULES:
//   • What state transitions are valid (loading → success/failure)
//   • What data the app tracks for authentication
//
// It has zero dependencies on the data layer or presentation layer.
//
// DATA FLOW through this file:
//   UI dispatches action  →  reducer runs  →  state updates  →  UI re-renders
//
// IMPORTANT: Reducers NEVER call APIs or do async work.
//            That's the Saga's job (see authSaga.ts).

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, LoginCredentials, User} from '../entities/Auth';

// ── Initial state: what Redux starts with before anything happens ──
const initialState: AuthState = {
  user: null,        // No one is logged in yet
  isLoading: false,  // We're not waiting for an API call
  error: null,       // No errors yet
};

// ── Create the slice ──
const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    /**
     * loginRequest — fired when the user taps "Login"
     *
     * Sets isLoading = true and clears previous errors.
     * The Saga is ALSO listening for this action type and kicks off the API call.
     */
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.isLoading = true;
      state.error = null;
    },

    /**
     * loginSuccess — fired by the Saga after the API returns a user
     */
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },

    /**
     * loginFailure — fired by the Saga when the API rejects
     */
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    /**
     * logout — resets auth state back to the beginning
     */
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

// ── Export action creators ──
export const {loginRequest, loginSuccess, loginFailure, logout} =
  authSlice.actions;

// ── Export the reducer ──
export default authSlice.reducer;

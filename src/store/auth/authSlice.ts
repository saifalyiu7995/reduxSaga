// ============================================================
// AUTH SLICE — Redux state + actions for authentication
// ============================================================
// WHERE THIS FITS:  This is the HEART of Redux state management.
//
// A "slice" bundles together:
//   • Initial state   — what does auth state look like at app start?
//   • Reducers        — pure functions that UPDATE state in response to actions
//   • Action creators — auto-generated functions the UI calls to trigger changes
//
// DATA FLOW through this file:
//   UI dispatches action  →  reducer runs  →  state updates  →  UI re-renders
//
// IMPORTANT: Reducers NEVER call APIs or do async work.
//            That's the Saga's job (see authSaga.ts).

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, LoginCredentials, User} from '../../types/auth';

// ── Initial state: what Redux starts with before anything happens ──
const initialState: AuthState = {
  user: null,        // No one is logged in yet
  isLoading: false,  // We're not waiting for an API call
  error: null,       // No errors yet
};

// ── Create the slice ──
// createSlice auto-generates action creators from the reducer names.
// For example, the "loginRequest" reducer below also creates
// an action creator called authSlice.actions.loginRequest().
const authSlice = createSlice({
  name: 'auth', // Prefix for action types: "auth/loginRequest", "auth/loginSuccess", etc.

  initialState,

  reducers: {
    /**
     * loginRequest — fired when the user taps "Login"
     *
     * DATA FLOW:
     *   1. UI calls dispatch(loginRequest({ email, password }))
     *   2. This reducer sets isLoading = true and clears previous errors
     *   3. The Saga is ALSO listening for this action type (see authSaga.ts)
     *      and kicks off the API call
     *
     * NOTE: We receive the credentials in the action payload, but we don't
     *       store them in state — the Saga picks them up from the action.
     */
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.isLoading = true;  // Show a loading spinner in the UI
      state.error = null;      // Clear any old error messages
    },

    /**
     * loginSuccess — fired by the Saga after the API returns a user
     *
     * DATA FLOW:
     *   1. Saga calls: put(loginSuccess(user))
     *   2. This reducer stores the user and sets isLoading = false
     *   3. UI re-renders and shows the welcome message
     */
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;        // Hide the spinner
      state.user = action.payload;    // Store the logged-in user
      state.error = null;             // Ensure no error is shown
    },

    /**
     * loginFailure — fired by the Saga when the API rejects
     *
     * DATA FLOW:
     *   1. Saga calls: put(loginFailure("Invalid email or password"))
     *   2. This reducer stores the error message
     *   3. UI re-renders and shows the error to the user
     */
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;       // Hide the spinner
      state.error = action.payload;  // Show what went wrong
    },

    /**
     * logout — resets auth state back to the beginning
     *
     * DATA FLOW:
     *   1. UI calls dispatch(logout())
     *   2. State goes back to initialState
     *   3. UI re-renders and shows the login form again
     */
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

// ── Export action creators ──
// These are what the UI (and Saga) import to dispatch actions.
// Example: dispatch(loginRequest({ email: '...', password: '...' }))
export const {loginRequest, loginSuccess, loginFailure, logout} =
  authSlice.actions;

// ── Export the reducer ──
// This is what the store imports to know how to handle auth actions.
export default authSlice.reducer;

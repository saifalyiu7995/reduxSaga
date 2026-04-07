// ============================================================
// AUTH SELECTORS — Memoized state accessors for the auth feature
// ============================================================
// CLEAN ARCHITECTURE LAYER: Domain
//
// Selectors centralize HOW you read auth state from the Redux store.
//
// WHY USE SELECTORS?
//   1. Single source of truth — if state shape changes, update ONLY here.
//   2. Reusable — any component can import these instead of writing inline selectors.
//   3. Memoizable — you can wrap them with `createSelector` (reselect) later
//      to avoid unnecessary re-renders.
//
// USAGE IN COMPONENTS:
//   const user = useSelector(selectUser);
//   const isLoading = useSelector(selectAuthLoading);

import {RootState} from '../../../store';

/** Select the entire auth slice */
export const selectAuth = (state: RootState) => state.auth;

/** Select the logged-in user (or null) */
export const selectUser = (state: RootState) => state.auth.user;

/** Select whether an auth API call is in progress */
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

/** Select the current auth error message (or null) */
export const selectAuthError = (state: RootState) => state.auth.error;

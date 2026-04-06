// ============================================================
// AUTH SAGA — Side-effect handler for authentication
// ============================================================
// WHERE THIS FITS:  Action dispatched → Reducer updates state
//                                      → **Saga intercepts action & does async work**
//
// WHY SAGAS?
//   Reducers must be pure (no API calls, no async code).
//   Sagas are "background workers" that listen for specific actions,
//   perform async operations (like API calls), and then dispatch
//   new actions with the results.
//
// MENTAL MODEL:
//   Think of a saga as a waiter at a restaurant:
//   1. The customer (UI) places an order (dispatches loginRequest)
//   2. The waiter (saga) takes the order to the kitchen (calls API)
//   3. The waiter brings back the food (dispatches loginSuccess)
//      or tells the customer the kitchen is out (dispatches loginFailure)
//
// KEY SAGA EFFECTS used here:
//   • takeLatest  — "only handle the MOST RECENT login attempt"
//                    (cancels any older, in-flight login if user taps again)
//   • call        — "call this function and WAIT for the Promise to resolve"
//   • put         — "dispatch this Redux action"

import {call, put, takeLatest} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import {loginApi} from '../../api/authApi';
import {loginRequest, loginSuccess, loginFailure} from './authSlice';
import {LoginCredentials, User} from '../../types/auth';

/**
 * WORKER SAGA — handleLogin
 *
 * This function does the actual async work for a login attempt.
 *
 * DATA FLOW:
 *   1. Receives the full Redux action (which contains { email, password } in payload)
 *   2. Calls the mock API using `call()` — this PAUSES the saga until the Promise resolves
 *   3a. If API succeeds → dispatches loginSuccess(user) via `put()`
 *   3b. If API fails    → dispatches loginFailure(errorMessage) via `put()`
 *
 * After put() dispatches an action, the REDUCER in authSlice.ts handles updating the state,
 * and React automatically re-renders the UI.
 */
function* handleLogin(action: PayloadAction<LoginCredentials>) {
  try {
    // call() tells the saga middleware: "call loginApi with these args, and pause here"
    // When the Promise resolves, the result (User object) is assigned to `user`
    const user: User = yield call(loginApi, action.payload);

    // put() tells the saga middleware: "dispatch this action to the Redux store"
    // This will trigger the loginSuccess reducer in authSlice.ts
    yield put(loginSuccess(user));
  } catch (error: any) {
    // If the API Promise rejects, we land here
    // We dispatch loginFailure with the error message string
    yield put(loginFailure(error.message || 'Login failed'));
  }
}

/**
 * WATCHER SAGA — watchLogin
 *
 * This is the "entry point" saga for the auth feature.
 * It sits in an infinite loop, waiting for loginRequest actions.
 *
 * takeLatest means:
 *   "If a new loginRequest comes in while an old one is still running,
 *    CANCEL the old one and start a fresh handleLogin."
 *
 * This prevents bugs like:
 *   - User taps login, then taps again → only the second attempt matters
 *   - Avoids race conditions with multiple API calls
 *
 * DATA FLOW:
 *   1. Redux store dispatches loginRequest action
 *   2. takeLatest catches it and calls handleLogin
 *   3. handleLogin does the API work (see above)
 */
export function* watchLogin() {
  yield takeLatest(loginRequest.type, handleLogin);
}

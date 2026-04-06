// ============================================================
// ROOT SAGA — Combines all feature sagas into one entry point
// ============================================================
// WHERE THIS FITS:  Store setup calls sagaMiddleware.run(rootSaga)
//                   rootSaga starts ALL feature sagas in parallel.
//
// WHY: As your app grows you'll have many features (auth, profile, cart, etc.),
//      each with its own saga. rootSaga is the single place where you "register"
//      them all, so the saga middleware knows to run them.
//
// DATA FLOW:
//   App starts → store is created → sagaMiddleware.run(rootSaga)
//   → rootSaga forks all watcher sagas → they sit and listen for actions

import {all, fork} from 'redux-saga/effects';
import {watchLogin} from './auth/authSaga';

/**
 * rootSaga — starts all feature sagas.
 *
 * • all()  — runs everything inside it in parallel (like Promise.all)
 * • fork() — starts a saga in the background without blocking
 *
 * To add a new feature saga later, just add another fork() line:
 *   fork(watchProfileUpdate),
 *   fork(watchCartActions),
 */
export default function* rootSaga() {
  yield all([
    fork(watchLogin),
    // Add more feature sagas here as your app grows:
    // fork(watchSignup),
    // fork(watchFetchProfile),
  ]);
}

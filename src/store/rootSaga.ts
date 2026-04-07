// ============================================================
// ROOT SAGA — Combines all feature sagas into one entry point
// ============================================================
// Shared infrastructure — starts ALL feature sagas in parallel.
//
// DATA FLOW:
//   App starts → store created → sagaMiddleware.run(rootSaga)
//   → rootSaga forks all feature watcher sagas

import {all, fork} from 'redux-saga/effects';
import {watchLogin} from '../auth/domain/slice/authSaga';

/**
 * rootSaga — starts all feature sagas.
 *
 * To add a new feature saga, add another fork() line:
 *   fork(watchFetchArticles),
 *   fork(watchProfileUpdate),
 */
export default function* rootSaga() {
  yield all([
    fork(watchLogin),
    // fork(watchFetchArticles),
  ]);
}

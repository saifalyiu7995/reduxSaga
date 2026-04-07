// ============================================================
// AUTH SAGA — Side-effect handler for authentication
// ============================================================
// CLEAN ARCHITECTURE LAYER: Domain
//
// The saga orchestrates the business flow:
//   1. Intercept loginRequest action
//   2. Call the repository (via the interface)
//   3. Dispatch success or failure
//
// DEPENDENCY INVERSION:
//   The saga imports AuthRepositoryImpl here at the wiring point.
//   In a larger app, you'd inject this via a DI container or factory.
//   For testing, you can replace it with a mock repository.
//
// KEY SAGA EFFECTS:
//   • takeLatest — only handle the MOST RECENT login attempt
//   • call       — call a function and WAIT for the Promise
//   • put        — dispatch a Redux action

import {call, put, takeLatest} from 'redux-saga/effects';
import {PayloadAction} from '@reduxjs/toolkit';
import {loginRequest, loginSuccess, loginFailure} from './authSlice';
import {LoginCredentials, User} from '../entities/Auth';
import {AuthRepository} from '../repository/AuthRepository';
import {AuthRepositoryImpl} from '../../data/repositories/AuthRepositoryImpl';

// ── Instantiate the concrete repository ──
// This is the single wiring point where domain meets data.
const authRepository: AuthRepository = new AuthRepositoryImpl();

/**
 * WORKER SAGA — handleLogin
 *
 * DATA FLOW:
 *   1. Receives action with { email, password } in payload
 *   2. Calls authRepository.login() — PAUSES until Promise resolves
 *   3a. Success → dispatches loginSuccess(user)
 *   3b. Failure → dispatches loginFailure(errorMessage)
 */
function* handleLogin(action: PayloadAction<LoginCredentials>) {
  try {
    const user: User = yield call(
      [authRepository, authRepository.login],
      action.payload,
    );
    yield put(loginSuccess(user));
  } catch (error: any) {
    yield put(loginFailure(error.message || 'Login failed'));
  }
}

/**
 * WATCHER SAGA — watchLogin
 *
 * takeLatest: if a new loginRequest arrives while one is in-flight,
 * cancel the old one and start fresh.
 */
export function* watchLogin() {
  yield takeLatest(loginRequest.type, handleLogin);
}

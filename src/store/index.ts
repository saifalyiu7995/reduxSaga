// ============================================================
// REDUX STORE — The single source of truth for the entire app
// ============================================================
// This is the CENTRAL HUB — shared infrastructure, not tied to any feature.
//
// DATA FLOW:
//   1. App.tsx wraps everything in <Provider store={store}>
//   2. Components use useSelector (via domain selectors) to READ state
//   3. Components use dispatch (via domain actions) to TRIGGER changes
//   4. Saga middleware intercepts actions for async work
//   5. Reducers pure-update the state
//   6. React re-renders affected components

import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from '../auth/domain/slice/authSlice';
import rootSaga from './rootSaga';

// ── Create the Saga middleware ──
const sagaMiddleware = createSagaMiddleware();

// ── Create the Redux store ──
const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add more feature reducers as your app grows:
    // article: articleReducer,
    // profile: profileReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

// ── Start the root saga ──
sagaMiddleware.run(rootSaga);

// ── Export TypeScript types ──
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

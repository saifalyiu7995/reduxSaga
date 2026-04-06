// ============================================================
// REDUX STORE — The single source of truth for the entire app
// ============================================================
// WHERE THIS FITS:  This is the CENTRAL HUB of data in your app.
//
//   Every piece of state lives in the store.
//   Every component reads from the store (via useSelector).
//   Every state change goes through the store (via dispatch → reducer).
//
// DATA FLOW:
//   1. App.tsx wraps everything in <Provider store={store}>
//   2. Components use useSelector(state => state.auth) to READ state
//   3. Components use dispatch(loginRequest({...})) to WRITE/trigger changes
//   4. The saga middleware intercepts actions for async work
//   5. Reducers pure-update the state
//   6. React re-renders affected components

import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './auth/authSlice';
import rootSaga from './rootSaga';

// ── Step 1: Create the Saga middleware instance ──
// This is a "plugin" that sits between dispatch() and the reducers.
// It watches every dispatched action and lets our sagas respond to them.
const sagaMiddleware = createSagaMiddleware();

// ── Step 2: Create the Redux store ──
const store = configureStore({
  // Register all feature reducers here.
  // `state.auth` will be managed by authReducer.
  reducer: {
    auth: authReducer,
    // Add more reducers as your app grows:
    // profile: profileReducer,
    // cart: cartReducer,
  },

  // Add the saga middleware to the default middleware chain.
  // We also disable serializableCheck because saga actions sometimes
  // contain non-serializable values (like Promises or Error objects).
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

// ── Step 3: Start the root saga ──
// This kicks off all watcher sagas so they begin listening for actions.
// MUST be called AFTER the store is created.
sagaMiddleware.run(rootSaga);

// ── Export TypeScript types for use throughout the app ──
// RootState: the shape of the entire Redux store (used with useSelector)
// AppDispatch: the type of the dispatch function (used with useDispatch)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

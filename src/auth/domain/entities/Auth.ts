// ============================================================
// AUTH ENTITIES — Domain types for the auth feature
// ============================================================
// CLEAN ARCHITECTURE LAYER: Domain (innermost)
//
// These are the CORE business objects of authentication.
// They have NO dependencies on any framework, API, or library.
// Every other layer depends on these — never the reverse.
//
// WHY SEPARATE FROM MODELS?
//   Models (data layer) represent the raw API response shape.
//   Entities represent what YOUR APP cares about.
//   A mapper in the data layer converts Model → Entity.

/**
 * What the user types into the login form.
 * The UI component creates this object and sends it to Redux.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * The core User entity in the domain.
 * This is the "clean" representation of a user throughout the app.
 * It travels from: Data Layer → Saga → Redux Store → UI.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

/**
 * The shape of the auth slice in the Redux store.
 * The UI reads this to know what to display.
 */
export interface AuthState {
  user: User | null;      // null = not logged in
  isLoading: boolean;     // true while the API call is in progress
  error: string | null;   // holds error message if login failed
}

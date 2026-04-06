// ============================================================
// AUTH TYPES — Shared TypeScript interfaces for the auth feature
// ============================================================
// WHY: We define types in one place so every layer (API, Redux, UI)
// speaks the same "language". This prevents bugs from mismatched shapes.

/**
 * What the user types into the login form.
 * The UI component creates this object and sends it to Redux.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * What the API returns on a successful login.
 * This travels from the API → Saga → Redux Store → UI.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  token: string; // In a real app this would be a JWT token
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

// ============================================================
// AUTH API — Mock network layer (Data Layer)
// ============================================================
// WHERE THIS FITS:  UI → Redux Action → **Saga calls THIS** → result back to Saga
//
// In clean architecture, the API layer is the outermost boundary.
// It talks to external services. Here we MOCK it with a setTimeout
// so you can see the loading spinner and async flow in action.
//
// In a real app, you'd replace the body of loginApi() with a
// fetch() or axios.post() call to your backend.

import {LoginCredentials, User} from '../types/auth';

// ── Mock credentials (pretend this lives on a server) ──
const MOCK_USER: User = {
  id: '1',
  name: 'Test User',
  email: 'test@test.com',
  token: 'mock-jwt-token-abc123',
};

const MOCK_PASSWORD = 'password123';

/**
 * Simulates a login API call.
 *
 * DATA FLOW:
 *   1. The Saga calls this function with credentials from the Redux action.
 *   2. We wait 1.5 seconds (simulating network latency).
 *   3. We check credentials against our mock data.
 *   4. We resolve (success) or reject (failure) the Promise.
 *   5. The Saga receives the result and dispatches the next Redux action.
 *
 * @param credentials - { email, password } from the login form
 * @returns Promise<User> - resolves with user data or rejects with an error
 */
export const loginApi = (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay of 1.5 seconds
    setTimeout(() => {
      // Check mock credentials (in reality, your server does this)
      if (
        credentials.email === MOCK_USER.email &&
        credentials.password === MOCK_PASSWORD
      ) {
        // ✅ Credentials match → return the user object
        resolve(MOCK_USER);
      } else {
        // ❌ Credentials don't match → return an error
        reject(new Error('Invalid email or password'));
      }
    }, 1500);
  });
};

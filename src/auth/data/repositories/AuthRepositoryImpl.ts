// ============================================================
// AUTH REPOSITORY IMPL — Concrete data source (Data Layer)
// ============================================================
// CLEAN ARCHITECTURE LAYER: Data (outermost)
//
// This implements the AuthRepository interface defined in the domain layer.
// It knows HOW to fetch auth data (mock API, REST, GraphQL, Firebase, etc.).
//
// The domain layer (saga) depends on the INTERFACE, not this class.
// This keeps the domain pure and testable.
//
// DATA FLOW:
//   Saga → calls authRepository.login(credentials)
//        → this class handles the actual API call
//        → converts the API response (Model) into a domain entity (User)
//        → returns the User to the saga

import {AuthRepository} from '../../domain/repository/AuthRepository';
import {LoginCredentials, User} from '../../domain/entities/Auth';
import {LoginResponseModel, toDomain} from '../models/LoginResponseModel';

// ── Mock data (pretend this lives on a server) ──
const MOCK_RESPONSE: LoginResponseModel = {
  id: '1',
  name: 'Test User',
  email: 'test@test.com',
  token: 'mock-jwt-token-abc123',
};

const MOCK_PASSWORD = 'password123';

/**
 * Concrete implementation of AuthRepository.
 *
 * Currently uses a mock API. To connect to a real backend,
 * replace the setTimeout with fetch() or axios.post() —
 * the rest of the app remains untouched.
 */
export class AuthRepositoryImpl implements AuthRepository {
  /**
   * Simulates a login API call.
   *
   * DATA FLOW:
   *   1. Receives credentials from the saga
   *   2. Waits 1.5s (simulating network latency)
   *   3. Validates credentials against mock data
   *   4. Converts LoginResponseModel → User entity via toDomain()
   *   5. Returns the User entity (or throws an error)
   */
  async login(credentials: LoginCredentials): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (
          credentials.email === MOCK_RESPONSE.email &&
          credentials.password === MOCK_PASSWORD
        ) {
          // ✅ Convert API model → domain entity
          resolve(toDomain(MOCK_RESPONSE));
        } else {
          // ❌ Credentials don't match
          reject(new Error('Invalid email or password'));
        }
      }, 1500);
    });
  }
}

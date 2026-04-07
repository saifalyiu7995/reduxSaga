// ============================================================
// AUTH REPOSITORY — Abstract interface (Domain Layer)
// ============================================================
// CLEAN ARCHITECTURE LAYER: Domain
//
// This is the DEPENDENCY INVERSION boundary.
//
// The domain layer defines WHAT it needs (this interface),
// but NOT HOW it's done. The data layer provides the concrete
// implementation (AuthRepositoryImpl).
//
// WHY?
//   • The saga (domain) depends on this interface, not on the API directly.
//   • You can swap AuthRepositoryImpl for a mock without touching domain code.
//   • Makes testing trivial — inject a fake repository into the saga.
//
// DATA FLOW:
//   Saga → calls AuthRepository.login()
//        → at runtime, AuthRepositoryImpl handles the actual API call

import {LoginCredentials, User} from '../entities/Auth';

/**
 * Contract for any authentication data source.
 *
 * The saga depends on THIS interface — it doesn't know or care
 * whether the implementation talks to a REST API, GraphQL, Firebase, etc.
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
}

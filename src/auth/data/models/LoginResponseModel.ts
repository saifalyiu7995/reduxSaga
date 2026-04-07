// ============================================================
// LOGIN RESPONSE MODEL — API Data Transfer Object (DTO)
// ============================================================
// CLEAN ARCHITECTURE LAYER: Data (outermost)
//
// This represents the RAW shape of data coming from the API.
// In a real app, the API might return extra fields, nested objects,
// or use different naming conventions (snake_case, etc.).
//
// The toDomain() method maps this raw shape into a clean User entity
// that the rest of the app understands.
//
// WHY SEPARATE FROM ENTITIES?
//   • API responses can change (new fields, renamed keys) — you only
//     update this file and the mapper, not the entire app.
//   • Entities stay pure and stable across API changes.

import {User} from '../../domain/entities/Auth';

/**
 * Raw API response shape for a successful login.
 *
 * In a real app, this might look different from the domain User entity.
 * For example, the API might return `access_token` instead of `token`,
 * or include extra fields like `refresh_token`, `expires_at`, etc.
 */
export interface LoginResponseModel {
  id: string;
  name: string;
  email: string;
  token: string;
}

/**
 * Maps a raw API response to a clean domain User entity.
 *
 * DATA FLOW:
 *   API response (JSON) → LoginResponseModel → toDomain() → User entity
 *
 * If the API shape changes, you only update THIS mapper —
 * the rest of the app continues to work with the User entity.
 */
export function toDomain(model: LoginResponseModel): User {
  return {
    id: model.id,
    name: model.name,
    email: model.email,
    token: model.token,
  };
}

// ============================================================
// LOGIN SCREEN — The UI component (Presentation Layer)
// ============================================================
// WHERE THIS FITS:  This is what the user SEES and INTERACTS with.
//
// DATA FLOW OVERVIEW:
//   1. User types email/password → stored in local React state (useState)
//   2. User taps "Login" → component calls dispatch(loginRequest({ email, password }))
//   3. Redux receives the action → reducer sets isLoading=true
//   4. Saga intercepts the action → calls mock API → waits for response
//   5. API responds → saga dispatches loginSuccess or loginFailure
//   6. Reducer updates state → this component RE-RENDERS with new data
//   7. UI shows either welcome message (success) or error (failure)
//
// KEY HOOKS:
//   • useSelector — reads data FROM the Redux store (like a "getter")
//   • useDispatch — returns the dispatch function to SEND actions TO the store

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '../store';
import {loginRequest, logout} from '../store/auth/authSlice';

const LoginScreen: React.FC = () => {
  // ── Local state for form inputs ──
  // These are NOT in Redux because they're temporary UI-only values.
  // Only "important" shared state goes into Redux.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ── Connect to Redux ──
  // useDispatch: gives us the dispatch() function to send actions to the store
  const dispatch = useDispatch<AppDispatch>();

  // useSelector: reads a slice of Redux state and re-renders when it changes.
  // Here we grab the entire auth state: { user, isLoading, error }
  // `state.auth` corresponds to the `auth: authReducer` key in store/index.ts
  const {user, isLoading, error} = useSelector(
    (state: RootState) => state.auth,
  );

  // ── Handler: fires when user taps the Login button ──
  const handleLogin = () => {
    // Guard: don't submit empty fields
    if (!email.trim() || !password.trim()) {
      return;
    }

    // Dispatch the loginRequest action with credentials.
    // This does TWO things simultaneously:
    //   1. The REDUCER sets isLoading = true (shows spinner)
    //   2. The SAGA intercepts this action and calls the mock API
    dispatch(loginRequest({email: email.trim(), password}));
  };

  // ── Handler: fires when user taps Logout ──
  const handleLogout = () => {
    // Dispatch logout action → reducer resets state → UI shows login form again
    dispatch(logout());
    setEmail('');
    setPassword('');
  };

  // ── RENDER: Logged-in view ──
  // If user exists in Redux state, it means login was successful
  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.welcomeIcon}>🎉</Text>
          <Text style={styles.welcomeTitle}>Welcome!</Text>
          <Text style={styles.welcomeName}>{user.name}</Text>
          <Text style={styles.welcomeEmail}>{user.email}</Text>
          <Text style={styles.tokenLabel}>Your token:</Text>
          <Text style={styles.tokenValue}>{user.token}</Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── RENDER: Login form ──
  return (
    <KeyboardAvoidingView
      style={styles.container}
      // On iOS the keyboard pushes content up; on Android it resizes
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {/* ── Header ── */}
          <Text style={styles.logo}>🔐</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* ── Error message ── */}
          {/* Shows only when `error` is not null in Redux state */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}

          {/* ── Email input ── */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="test@test.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail} // Updates local state, NOT Redux
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading} // Disable input while API is loading
          />

          {/* ── Password input ── */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="password123"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword} // Updates local state, NOT Redux
            secureTextEntry // Hides the password characters
            editable={!isLoading}
          />

          {/* ── Login button ── */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading} // Prevent double-taps while loading
          >
            {isLoading ? (
              // Show spinner while the saga is calling the API
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* ── Hint for the learner ── */}
          <View style={styles.hintContainer}>
            <Text style={styles.hintTitle}>Mock Credentials:</Text>
            <Text style={styles.hintText}>Email: test@test.com</Text>
            <Text style={styles.hintText}>Password: password123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Dark background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 32,
    // Subtle shadow
    shadowColor: '#0f3460',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0b0',
    textAlign: 'center',
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#a0a0b0',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#0f3460',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1a1a4e',
  },
  loginButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  errorContainer: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  errorText: {
    color: '#e94560',
    fontSize: 14,
    textAlign: 'center',
  },
  hintContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: 'rgba(15, 52, 96, 0.5)',
    borderRadius: 10,
  },
  hintTitle: {
    color: '#e94560',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  hintText: {
    color: '#a0a0b0',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  // ── Logged-in styles ──
  welcomeIcon: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4ecca3',
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  welcomeEmail: {
    fontSize: 14,
    color: '#a0a0b0',
    textAlign: 'center',
    marginBottom: 16,
  },
  tokenLabel: {
    fontSize: 12,
    color: '#a0a0b0',
    textAlign: 'center',
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 12,
    color: '#4ecca3',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#e94560',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;

// ============================================================
// APP ENTRY POINT — Wires Redux into the React Native app
// ============================================================
// WHERE THIS FITS:
//   index.js registers this component as the root of the app.
//   Here we wrap everything in Redux's <Provider> so that ALL child
//   components can access the Redux store via useSelector / useDispatch.
//
// DATA FLOW:
//   index.js  →  App.tsx (this file)  →  <Provider store={store}>
//                                              ↓
//                                         <LoginScreen />
//                                         (reads from & dispatches to store)

import React from 'react';
import {StatusBar, StyleSheet, View, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Provider is the "bridge" between Redux and React.
// It makes the store available to every component in the tree.
import {Provider} from 'react-redux';

// Our configured Redux store (with saga middleware already running)
import store from './src/store';

// The login screen component
import LoginScreen from './src/screens/LoginScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    // Provider wraps the ENTIRE app and passes the store down through React context.
    // Without this, useSelector and useDispatch would not work.
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="#1a1a2e"
        />
        <View style={styles.container}>
          {/* LoginScreen reads auth state from the store and dispatches actions */}
          <LoginScreen />
        </View>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

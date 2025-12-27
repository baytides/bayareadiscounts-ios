import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { initializeSentry, loadCrashReportingPreference, disableSentry } from './src/utils/crashReporting';
import appConfig from './app.json';

// Initialize Sentry synchronously before Sentry.wrap()
initializeSentry(appConfig.expo.version, appConfig.expo.ios.buildNumber);

function AppContent() {
  const { isDark } = useTheme();
  return (
    <>
      <AppNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      // Check if user has disabled crash reporting
      const crashReportingEnabled = await loadCrashReportingPreference();
      if (!crashReportingEnabled) {
        disableSentry();
      }
      setReady(true);
    }
    init();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default Sentry.wrap(App);

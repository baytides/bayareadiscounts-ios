import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { loadCrashReportingPreference } from './src/utils/crashReporting';
import appConfig from './app.json';

// Flag to track if Sentry has been initialized
let sentryInitialized = false;

function initializeSentry() {
  if (sentryInitialized) return;

  Sentry.init({
    dsn: 'https://d1129af3b07f8a71664d5b10f3756aba@o4510598177095680.ingest.us.sentry.io/4510598247219200',
    // Disable in development
    enabled: !__DEV__,
    // Release tracking for better debugging
    release: `org.baytides.bayareadiscounts@${appConfig.expo.version}+${appConfig.expo.ios.buildNumber}`,
    environment: __DEV__ ? 'development' : 'production',
    // Disable performance tracing for privacy
    tracesSampleRate: 0,
    // Don't send default PII
    sendDefaultPii: false,
    // Strip PII from crash reports
    beforeSend(event) {
      // Remove user IP address
      if (event.user) {
        delete event.user.ip_address;
      }
      // Remove device identifiers
      if (event.contexts?.device) {
        delete event.contexts.device.device_id;
      }
      return event;
    },
  });

  sentryInitialized = true;
}

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
      const crashReportingEnabled = await loadCrashReportingPreference();
      if (crashReportingEnabled) {
        initializeSentry();
      }
      setReady(true);
    }
    init();
  }, []);

  // Don't render until we've checked the preference
  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// Export with Sentry error boundary (only wraps if Sentry is enabled)
export default Sentry.withErrorBoundary(App, { fallback: <></> });

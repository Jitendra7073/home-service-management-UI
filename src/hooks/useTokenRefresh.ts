import { useEffect, useRef } from 'react';

/**
 * Hook to proactively refresh the access token before it expires.
 * Access tokens expire after 15 minutes, so we refresh at 14 minutes.
 */
export function useTokenRefresh() {
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Access token expiry time (15 minutes)
    const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;

    // Refresh 1 minute before expiry (14 minutes)
    const REFRESH_BEFORE_EXPIRY_MS = 1 * 60 * 1000;

    const refreshInterval = ACCESS_TOKEN_EXPIRY_MS - REFRESH_BEFORE_EXPIRY_MS;

    const scheduleNextRefresh = () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      refreshTimerRef.current = setTimeout(async () => {
        try {
          // Attempt to refresh the token proactively
          const response = await fetch('/api/auth/refresh-session', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Proactive token refresh error:', error);
          // Don't show error to user or redirect - let API calls handle that
        }

        // Schedule next refresh
        scheduleNextRefresh();
      }, refreshInterval);
    };

    // Start the refresh cycle
    scheduleNextRefresh();

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);
}

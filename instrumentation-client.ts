
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Monitor 10% of performance transactions.
  tracesSampleRate: 0.1,

  // Disable session replay.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Limit collection of personal information.
  dataCollection: {
    userInfo: false,
    httpBodies: [],
  },
});

export const onRouterTransitionStart =
  Sentry.captureRouterTransitionStart;

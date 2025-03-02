import * as Sentry from "@sentry/remix";

Sentry.init({
    dsn: "https://02eeb1e8483adfb72f189ac9b5a0721b@o4508907369725952.ingest.us.sentry.io/4508907369988096",
    tracesSampleRate: 1
})
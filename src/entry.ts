import { startServer } from '../server';

// Entrypoint: starts the Express server. Kept separate from server.ts so that
// importing the app (e.g. in tests) never starts a listener.
startServer();


declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      HOST?: string;
      NODE_ENV?: "development" | "production" | "test";
      AUTH_ALLOWED?: string;
      API_GLOBAL_PREFIX?: string;
    }
  }
  var __TEARDOWN_MESSAGE__: string;
}

export {};

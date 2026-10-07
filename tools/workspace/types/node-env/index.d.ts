declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      HOST?: string;
      NODE_ENV?: "development" | "production" | "test";
      API_GLOBAL_PREFIX?: string;
      PERSISTENCE?: string;
      DATABASE_URL?: string;
      DIRECT_URL?: string;
      SUPABASE_URL?: string;
      SUPABASE_JWKS_URL?: string;
      SUPABASE_SERVICE_ROLE_KEY?: string;
      VITE_API_URL?: string;
      VITE_SUPABASE_URL?: string;
      VITE_SUPABASE_ANON_KEY?: string;
    }
  }
  var __TEARDOWN_MESSAGE__: string;
}

export {};

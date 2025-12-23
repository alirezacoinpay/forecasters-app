/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_APP_ENV?: 'development' | 'production' | 'staging';
    readonly VITE_DEFAULT_TOPIC_NAME?: string; // Default topic name (defaults to "Forecasters")
    readonly VITE_DEFAULT_LANGUAGE?: 'fa' | 'en'; // Default language (defaults to 'fa')
    // Add other environment variables here
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_PATH?: string
  readonly VITE_API_GATEWAY_URL?: string
  readonly VITE_CATALOG_SERVICE_URL?: string
  readonly VITE_LISTING_SERVICE_URL?: string
  readonly VITE_PROMOTION_SERVICE_URL?: string
  readonly VITE_WORKER_SERVICE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export type ServiceKey =
  | 'apiGateway'
  | 'catalog'
  | 'listing'
  | 'promotion'
  | 'worker'

export type ServiceEndpoint = {
  key: ServiceKey
  label: string
  url: string
  healthPath: string
}

const trimSlash = (value: string) => value.replace(/\/$/, '')

/**
 * Frontend attaches to backend services via Vite env vars.
 * On GitHub Pages, set repository Variables (Settings → Secrets and variables → Actions → Variables).
 * Local Docker defaults: gateway 8001 … worker 8005.
 */
export const serviceEndpoints: ServiceEndpoint[] = [
  {
    key: 'apiGateway',
    label: 'API Gateway',
    url: trimSlash(import.meta.env.VITE_API_GATEWAY_URL || 'http://127.0.0.1:8001'),
    healthPath: '/health',
  },
  {
    key: 'catalog',
    label: 'Catalog',
    url: trimSlash(import.meta.env.VITE_CATALOG_SERVICE_URL || 'http://127.0.0.1:8002'),
    healthPath: '/health',
  },
  {
    key: 'listing',
    label: 'Listing',
    url: trimSlash(import.meta.env.VITE_LISTING_SERVICE_URL || 'http://127.0.0.1:8003'),
    healthPath: '/health',
  },
  {
    key: 'promotion',
    label: 'Promotion',
    url: trimSlash(import.meta.env.VITE_PROMOTION_SERVICE_URL || 'http://127.0.0.1:8004'),
    healthPath: '/health',
  },
  {
    key: 'worker',
    label: 'Worker',
    url: trimSlash(import.meta.env.VITE_WORKER_SERVICE_URL || 'http://127.0.0.1:8005'),
    healthPath: '/health',
  },
]

export const apiGatewayUrl = serviceEndpoints[0].url

export const isGitHubPagesHost =
  typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')

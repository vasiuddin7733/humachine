import { useEffect, useState } from 'react'

import { isGitHubPagesHost, serviceEndpoints, type ServiceEndpoint } from './config'

type HealthState = 'checking' | 'ok' | 'down' | 'unset'

type Row = ServiceEndpoint & { state: HealthState }

async function probe(endpoint: ServiceEndpoint): Promise<HealthState> {
  if (!endpoint.url) {
    return 'unset'
  }

  try {
    const response = await fetch(`${endpoint.url}${endpoint.healthPath}`, {
      method: 'GET',
      mode: 'cors',
    })
    return response.ok ? 'ok' : 'down'
  } catch {
    return 'down'
  }
}

function stateLabel(state: HealthState) {
  switch (state) {
    case 'checking':
      return 'Checking…'
    case 'ok':
      return 'Connected'
    case 'down':
      return 'Unreachable'
    case 'unset':
      return 'Not configured'
  }
}

function stateClass(state: HealthState) {
  switch (state) {
    case 'checking':
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
    case 'ok':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
    case 'down':
      return 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200'
    case 'unset':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
  }
}

export function ServiceConnections() {
  const [rows, setRows] = useState<Row[]>(() =>
    serviceEndpoints.map((endpoint) => ({ ...endpoint, state: 'checking' })),
  )

  useEffect(() => {
    let cancelled = false

    void (async () => {
      const next = await Promise.all(
        serviceEndpoints.map(async (endpoint) => ({
          ...endpoint,
          state: await probe(endpoint),
        })),
      )
      if (!cancelled) {
        setRows(next)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90"
      aria-label="Backend service connections"
    >
      <div className="mb-5">
        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
          Backend services
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Frontend attaches via <code className="text-sm">VITE_*_URL</code> env vars.
          {isGitHubPagesHost
            ? ' GitHub Pages hosts only this UI — point these URLs at free API hosts (Render/Railway/Fly) or local Docker with CORS enabled.'
            : ' Local Docker defaults: gateway 8001 → worker 8005.'}
        </p>
      </div>
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {rows.map((row) => (
          <li
            key={row.key}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <strong className="text-slate-900 dark:text-slate-50">{row.label}</strong>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stateClass(row.state)}`}>
                {stateLabel(row.state)}
              </span>
            </div>
            <p className="break-all text-xs text-slate-500 dark:text-slate-400">{row.url}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

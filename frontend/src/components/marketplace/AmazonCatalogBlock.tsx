import { useState } from 'react'

import type { ChannelState, Product } from '../../types/marketplace'
import { nextAction, promotionLabel, statusLabel } from '../../utils/marketplace'

type AmazonMethod = 'search' | 'image' | 'product_ids' | 'web_url' | 'blank_form' | 'spreadsheet'

const methods: { id: AmazonMethod; label: string; description: string }[] = [
  {
    id: 'search',
    label: 'Search',
    description: 'Find an existing catalog item and match your offer to it.',
  },
  {
    id: 'image',
    label: 'Product image',
    description: 'Upload a product photo and let Amazon suggest matching listings.',
  },
  {
    id: 'product_ids',
    label: 'Product IDs',
    description: 'List using UPC, EAN, ISBN, or other product identifiers.',
  },
  {
    id: 'web_url',
    label: 'Web URL',
    description: 'Paste a product page URL to pre-fill listing attributes.',
  },
  {
    id: 'blank_form',
    label: 'Blank form',
    description: 'List a single product from scratch using a blank interactive web form.',
  },
  {
    id: 'spreadsheet',
    label: 'Spreadsheet',
    description: 'Bulk upload multiple SKUs using an inventory file template.',
  },
]

const references = [
  {
    title: 'What is a GTIN?',
    detail: 'Learn about UPC, EAN, JAN, and ISBN product identifiers.',
  },
  {
    title: 'Products requiring approval',
    detail: 'Some categories need additional approval before listing.',
  },
  {
    title: 'Create variations',
    detail: 'Add size, color, or style variations to an existing family.',
  },
  {
    title: 'Compliance references',
    detail: 'Review restricted products and compliance documentation.',
  },
  {
    title: 'Listing requirement updates',
    detail: 'Stay current with category-specific attribute changes.',
  },
]

type AmazonCatalogBlockProps = {
  product: Product
  channel: ChannelState
  onAdvance: () => void
}

function MethodIcon({ method }: { method: AmazonMethod }) {
  const common = 'h-7 w-7'

  switch (method) {
    case 'search':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'image':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" />
          <path d="M6 16L10 12L14 15L18 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'product_ids':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 6H19V18H5V6Z" stroke="currentColor" strokeWidth="2" />
          <path d="M7 9H17M7 12H17M7 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'web_url':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M4 12H20M12 4C9.5 7 8.5 9.5 8.5 12C8.5 14.5 9.5 17 12 20C14.5 17 15.5 14.5 15.5 12C15.5 9.5 14.5 7 12 4Z" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    case 'blank_form':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 4H17L20 7V20H7V4Z" stroke="currentColor" strokeWidth="2" />
          <path d="M10 9H16M10 12H16M10 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case 'spreadsheet':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
          <path d="M5 10H19M5 14H19M10 5V19M14 5V19" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
  }
}

export function AmazonCatalogBlock({ product, channel, onAdvance }: AmazonCatalogBlockProps) {
  const [method, setMethod] = useState<AmazonMethod>('blank_form')
  const selected = methods.find((item) => item.id === method) ?? methods[4]
  const actionLabel = nextAction(channel, 'amazon')

  return (
    <section
      className="overflow-hidden rounded-3xl border border-slate-200 bg-[#f0f2f2] shadow-sm"
      aria-label="Amazon catalog listing"
    >
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="rounded bg-[#232f3e] px-3 py-1 text-sm font-bold text-white">amazon</span>
          <span className="text-sm text-slate-500">Seller Central</span>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="flex items-center justify-center rounded-2xl bg-white p-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-2xl bg-[#fef3c7] text-5xl">
              📦
            </div>
            <p className="text-sm text-slate-500">Catalog preview</p>
          </div>
        </div>

        <div>
          <h3 className="text-3xl font-normal text-slate-900">
            List Your Products <span className="text-sm text-[#007185]">Learn more</span>
          </h3>
          <p className="mt-2 text-slate-600">Select an option to get started.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {methods.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={method === item.id}
                aria-label={item.label}
                onClick={() => setMethod(item.id)}
                className={`flex min-w-[88px] flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs font-medium transition ${
                  method === item.id
                    ? 'border-[#007185] bg-white text-[#007185] shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-[#007185]/40'
                }`}
              >
                <MethodIcon method={item.id} />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-xl border-2 border-[#007185] bg-white p-5">
            <p className="text-slate-700">{selected.description}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-[#007185]">Learn more</span>
              <button
                type="button"
                className="rounded-full bg-[#007185] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#005f70]"
                onClick={onAdvance}
                disabled={actionLabel === 'Promotion live'}
              >
                Start
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-slate-900">
              {product.title || 'Untitled product'} • {product.category || 'Category'} • SKU{' '}
              {product.sku}
            </p>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-[#e3f2f4] px-3 py-1 text-[#007185]">
                {statusLabel(channel.status, 'amazon')}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                Promotion: {promotionLabel(channel.promotionStatus)}
              </span>
            </div>
            <button
              type="button"
              className="mt-4 rounded-lg border border-[#007185] px-4 py-2 text-sm font-semibold text-[#007185] transition hover:bg-[#e3f2f4] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onAdvance}
              disabled={actionLabel === 'Promotion live'}
            >
              {actionLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-6 py-5">
        <h4 className="mb-4 text-lg font-semibold text-slate-900">Additional references</h4>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {references.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-[#fafafa] p-4">
              <h5 className="mb-2 text-sm font-semibold text-slate-900">{item.title}</h5>
              <p className="mb-3 text-xs text-slate-600">{item.detail}</p>
              <button type="button" className="text-xs font-semibold text-[#007185]">
                Learn more
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

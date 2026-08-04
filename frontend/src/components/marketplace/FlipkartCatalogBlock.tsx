import { useState } from 'react'

import type { ChannelState, Product } from '../../types/marketplace'
import { nextAction, promotionLabel, statusLabel } from '../../utils/marketplace'

type FlipkartStep = 'category' | 'details' | 'qc'

const steps: { id: FlipkartStep; label: string }[] = [
  { id: 'category', label: 'Select Category' },
  { id: 'details', label: 'Product Info' },
  { id: 'qc', label: 'QC & Go Live' },
]

type FlipkartCatalogBlockProps = {
  product: Product
  channel: ChannelState
  onAdvance: () => void
}

export function FlipkartCatalogBlock({ product, channel, onAdvance }: FlipkartCatalogBlockProps) {
  const [step, setStep] = useState<FlipkartStep>('category')
  const actionLabel = nextAction(channel, 'flipkart')

  return (
    <section
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      aria-label="Flipkart catalog listing"
    >
      <div className="bg-[#2874F0] px-6 py-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Flipkart Seller Hub</p>
            <h3 className="text-2xl font-bold">Add New Listing</h3>
          </div>
          <span className="rounded bg-[#FFE500] px-3 py-1 text-sm font-bold text-[#111827]">
            Seller+
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
          <p className="mb-4 text-sm font-semibold text-slate-900">Listing steps</p>
          <ol className="grid gap-3">
            {steps.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                    step === item.id
                      ? 'bg-[#2874F0] text-white'
                      : 'bg-white text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      step === item.id ? 'bg-white text-[#2874F0]' : 'bg-[#2874F0] text-white'
                    }`}
                  >
                    {index + 1}
                  </span>
                  {item.label}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-[#fcfdff] p-5">
          {step === 'category' ? (
            <div className="grid gap-4">
              <h4 className="text-lg font-semibold text-slate-900">Choose product category</h4>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Category search
                <input
                  readOnly
                  value={product.category || 'Select a category'}
                  aria-label="Flipkart category search"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                />
              </label>
              <div className="rounded-xl border border-dashed border-[#2874F0]/30 bg-white p-4 text-sm text-slate-600">
                Suggested path: Home &gt; {product.category || 'General'} &gt; New Arrivals
              </div>
            </div>
          ) : null}

          {step === 'details' ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Product title
                <input
                  readOnly
                  value={product.title}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Brand
                <input
                  readOnly
                  value="Generic"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                MRP
                <input
                  readOnly
                  value={`₹${(product.price * 1.2).toFixed(2)}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Selling price
                <input
                  readOnly
                  value={`₹${product.price.toFixed(2)}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                />
              </label>
              <label className="md:col-span-2 grid gap-2 text-sm font-medium text-slate-700">
                HSN code
                <input
                  readOnly
                  value="8518"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                />
              </label>
            </div>
          ) : null}

          {step === 'qc' ? (
            <div className="grid gap-4">
              <h4 className="text-lg font-semibold text-slate-900">Quality check summary</h4>
              <ul className="grid gap-2 text-sm text-slate-700">
                <li className="rounded-xl bg-white px-4 py-3 border border-slate-200">
                  Images uploaded: {product.imageUrls.length}
                </li>
                <li className="rounded-xl bg-white px-4 py-3 border border-slate-200">
                  Listing status: {statusLabel(channel.status, 'flipkart')}
                </li>
                <li className="rounded-xl bg-white px-4 py-3 border border-slate-200">
                  Promotion: {promotionLabel(channel.promotionStatus)}
                </li>
              </ul>
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <p className="text-sm text-slate-600">SKU {product.sku}</p>
            {step === 'qc' ? (
              <button
                type="button"
                className="rounded-xl bg-[#2874F0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c5fd0] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={onAdvance}
                disabled={actionLabel === 'Promotion live'}
              >
                {actionLabel}
              </button>
            ) : (
              <button
                type="button"
                className="rounded-xl bg-[#2874F0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c5fd0]"
                onClick={() => setStep(step === 'category' ? 'details' : 'qc')}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

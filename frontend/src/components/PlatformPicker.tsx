import type { Marketplace } from '../types/marketplace'
import { marketplaceLabel, marketplaceOptions } from '../utils/marketplace'

type PlatformPickerProps = {
  selected: Marketplace[]
  onToggle: (marketplace: Marketplace) => void
}

const platformMeta: Record<
  Marketplace,
  { description: string; accent: string; ring: string; logo: string }
> = {
  amazon: {
    description: 'List via Seller Central-style catalog tools',
    accent: 'border-[#007185] bg-[#f7fafa] text-[#007185]',
    ring: 'ring-[#007185]',
    logo: 'A',
  },
  flipkart: {
    description: 'Add listing through Flipkart Seller Hub flow',
    accent: 'border-[#2874F0] bg-[#f3f7ff] text-[#2874F0]',
    ring: 'ring-[#2874F0]',
    logo: 'F',
  },
  meesho: {
    description: 'Upload catalog like Meesho Supplier Panel',
    accent: 'border-[#9F2089] bg-[#fdf5fb] text-[#9F2089]',
    ring: 'ring-[#9F2089]',
    logo: 'M',
  },
}

export function PlatformPicker({ selected, onToggle }: PlatformPickerProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Choose platforms">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-slate-900">Choose platforms</h2>
        <p className="mt-2 text-slate-600">
          Select where you want to list this product. Each marketplace opens its own seller-style
          catalog block.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {marketplaceOptions.map((marketplace) => {
          const isSelected = selected.includes(marketplace)
          const meta = platformMeta[marketplace]

          return (
            <button
              key={marketplace}
              type="button"
              aria-pressed={isSelected}
              aria-label={marketplaceLabel(marketplace)}
              onClick={() => onToggle(marketplace)}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                isSelected
                  ? `${meta.accent} ${meta.ring} ring-2 ring-offset-2`
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                    isSelected ? 'bg-white' : 'bg-white text-slate-700'
                  }`}
                >
                  {meta.logo}
                </span>
                <strong className="text-lg text-slate-900">{marketplaceLabel(marketplace)}</strong>
              </div>
              <p className="text-sm text-slate-600">{meta.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

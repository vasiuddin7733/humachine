import type { ChannelState, Product } from '../../types/marketplace'
import { nextAction, promotionLabel, statusLabel } from '../../utils/marketplace'

type MeeshoCatalogBlockProps = {
  product: Product
  channel: ChannelState
  onAdvance: () => void
}

export function MeeshoCatalogBlock({ product, channel, onAdvance }: MeeshoCatalogBlockProps) {
  const actionLabel = nextAction(channel, 'meesho')

  return (
    <section
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
      aria-label="Meesho catalog listing"
    >
      <div className="bg-[#9F2089] px-6 py-5 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-100">Meesho Supplier Panel</p>
        <h3 className="text-2xl font-bold">Add Product to Catalog</h3>
        <p className="mt-1 text-sm text-fuchsia-100">
          Upload product details and images for supplier review.
        </p>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-2xl border border-fuchsia-100 bg-[#fdf5fb] p-4">
          <p className="mb-3 text-sm font-semibold text-slate-900">Catalog images</p>
          {product.imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {product.imageUrls.slice(0, 4).map((url, index) => (
                <img
                  key={url}
                  src={url}
                  alt={`Meesho catalog ${index + 1}`}
                  className="aspect-square rounded-xl border border-fuchsia-100 object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-[#9F2089]/30 bg-white text-sm text-slate-500">
              Upload images above
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-fuchsia-100 bg-[#fffafd] p-5">
          <div className="mb-5 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Product name
              <input
                readOnly
                value={product.title}
                className="rounded-xl border border-fuchsia-100 bg-white px-4 py-3 text-slate-900"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Meesho category
              <input
                readOnly
                value={product.category}
                aria-label="Meesho category"
                className="rounded-xl border border-fuchsia-100 bg-white px-4 py-3 text-slate-900"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Supplier price
              <input
                readOnly
                value={`₹${product.price.toFixed(2)}`}
                className="rounded-xl border border-fuchsia-100 bg-white px-4 py-3 text-slate-900"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              MRP
              <input
                readOnly
                value={`₹${(product.price * 1.35).toFixed(2)}`}
                className="rounded-xl border border-fuchsia-100 bg-white px-4 py-3 text-slate-900"
              />
            </label>
            <label className="md:col-span-2 grid gap-2 text-sm font-medium text-slate-700">
              Product description
              <textarea
                readOnly
                rows={3}
                value={`${product.title} listed for Meesho resellers with standard packaging and dispatch SLA.`}
                className="rounded-xl border border-fuchsia-100 bg-white px-4 py-3 text-slate-900"
              />
            </label>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#f7e6f3] px-3 py-1 text-sm text-[#9F2089]">
              {statusLabel(channel.status, 'meesho')}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              Promotion: {promotionLabel(channel.promotionStatus)}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-fuchsia-100 pt-5">
            <p className="text-sm text-slate-600">Catalog ID: {product.sku}</p>
            <button
              type="button"
              className="rounded-full bg-[#9F2089] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7f1a70] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={onAdvance}
              disabled={actionLabel === 'Promotion live'}
            >
              {actionLabel === 'Mark Meesho listing ready' ? 'Submit for Review' : actionLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

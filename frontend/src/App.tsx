import { useMemo, useState } from 'react'

type Marketplace = 'amazon' | 'flipkart' | 'meesho'
type ProductStatus = 'draft' | 'ready' | 'submitted' | 'active'
type PromotionStatus = 'not_started' | 'scheduled' | 'live'

type ChannelState = {
  status: ProductStatus
  promotionStatus: PromotionStatus
}

type Product = {
  id: number
  title: string
  category: string
  price: number
  sku: string
  marketplaces: Marketplace[]
  channelStates: Record<Marketplace, ChannelState>
}

const marketplaceOptions: Marketplace[] = ['amazon', 'flipkart', 'meesho']

const workflowSteps = [
  {
    title: 'Create product draft',
    detail: 'Capture title, category, SKU, and pricing before sending anything to any marketplace.',
  },
  {
    title: 'Choose channels',
    detail: 'Select Amazon, Flipkart, or Meesho based on where the product should be listed.',
  },
  {
    title: 'Submit marketplace listing',
    detail: 'Queue the listing for the selected channel and monitor the status independently.',
  },
  {
    title: 'Promote automatically',
    detail: 'Launch the campaign only after the chosen marketplace listing is active and inventory is available.',
  },
] as const

function emptyChannelState(): Record<Marketplace, ChannelState> {
  return {
    amazon: { status: 'draft', promotionStatus: 'not_started' },
    flipkart: { status: 'draft', promotionStatus: 'not_started' },
    meesho: { status: 'draft', promotionStatus: 'not_started' },
  }
}

const initialProducts: Product[] = [
  {
    id: 1,
    title: 'Noise Cancelling Headphones',
    category: 'Electronics',
    price: 129.99,
    sku: 'AMZ-HDPHN-001',
    marketplaces: ['amazon', 'flipkart'],
    channelStates: {
      amazon: { status: 'ready', promotionStatus: 'not_started' },
      flipkart: { status: 'submitted', promotionStatus: 'not_started' },
      meesho: { status: 'draft', promotionStatus: 'not_started' },
    },
  },
  {
    id: 2,
    title: 'Travel Backpack',
    category: 'Accessories',
    price: 89.0,
    sku: 'AMZ-BAG-014',
    marketplaces: ['amazon', 'meesho'],
    channelStates: {
      amazon: { status: 'submitted', promotionStatus: 'not_started' },
      flipkart: { status: 'draft', promotionStatus: 'not_started' },
      meesho: { status: 'ready', promotionStatus: 'not_started' },
    },
  },
  {
    id: 3,
    title: 'Reusable Water Bottle',
    category: 'Home & Kitchen',
    price: 24.5,
    sku: 'AMZ-HOME-220',
    marketplaces: ['amazon', 'flipkart', 'meesho'],
    channelStates: {
      amazon: { status: 'active', promotionStatus: 'scheduled' },
      flipkart: { status: 'active', promotionStatus: 'live' },
      meesho: { status: 'ready', promotionStatus: 'not_started' },
    },
  },
]

function marketplaceLabel(marketplace: Marketplace) {
  switch (marketplace) {
    case 'amazon':
      return 'Amazon'
    case 'flipkart':
      return 'Flipkart'
    case 'meesho':
      return 'Meesho'
  }
}

function nextAction(channelState: ChannelState, marketplace: Marketplace) {
  if (channelState.status === 'draft') {
    return `Mark ${marketplaceLabel(marketplace)} listing ready`
  }

  if (channelState.status === 'ready') {
    return `Submit to ${marketplaceLabel(marketplace)}`
  }

  if (channelState.status === 'submitted') {
    return `Activate ${marketplaceLabel(marketplace)} listing`
  }

  if (channelState.promotionStatus === 'not_started') {
    return `Launch ${marketplaceLabel(marketplace)} promotion`
  }

  if (channelState.promotionStatus === 'scheduled') {
    return `Set ${marketplaceLabel(marketplace)} campaign live`
  }

  return 'Promotion live'
}

function statusLabel(status: ProductStatus, marketplace: Marketplace) {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'ready':
      return 'Ready for listing'
    case 'submitted':
      return `Submitted to ${marketplaceLabel(marketplace)}`
    case 'active':
      return `Active on ${marketplaceLabel(marketplace)}`
  }
}

function promotionLabel(status: PromotionStatus) {
  switch (status) {
    case 'not_started':
      return 'Not started'
    case 'scheduled':
      return 'Scheduled'
    case 'live':
      return 'Live'
  }
}

function badgeTone(marketplace: Marketplace) {
  switch (marketplace) {
    case 'amazon':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200'
    case 'flipkart':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200'
    case 'meesho':
      return 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-200'
  }
}

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedId, setSelectedId] = useState<number>(initialProducts[0].id)
  const [selectedMarketplace, setSelectedMarketplace] = useState<Marketplace>('amazon')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<Marketplace[]>([
    'amazon',
    'flipkart',
  ])

  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0]
  const activeMarketplace = selectedProduct?.marketplaces.includes(selectedMarketplace)
    ? selectedMarketplace
    : selectedProduct?.marketplaces[0]
  const selectedChannel = activeMarketplace
    ? selectedProduct?.channelStates[activeMarketplace]
    : undefined

  const metrics = useMemo(() => {
    let active = 0
    let pending = 0
    let promoted = 0

    for (const product of products) {
      for (const marketplace of product.marketplaces) {
        const channel = product.channelStates[marketplace]

        if (channel.status === 'active') {
          active += 1
        } else {
          pending += 1
        }

        if (channel.promotionStatus === 'live') {
          promoted += 1
        }
      }
    }

    return { active, pending, promoted }
  }, [products])

  function toggleMarketplace(marketplace: Marketplace) {
    setSelectedMarketplaces((current) => {
      if (current.includes(marketplace)) {
        if (current.length === 1) {
          return current
        }

        return current.filter((value) => value !== marketplace)
      }

      return [...current, marketplace]
    })
  }

  function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !category.trim() || !price.trim() || selectedMarketplaces.length === 0) {
      return
    }

    const createdProduct: Product = {
      id: Date.now(),
      title: title.trim(),
      category: category.trim(),
      price: Number(price),
      sku: `SKU-${category.slice(0, 4).toUpperCase()}-${products.length + 100}`,
      marketplaces: selectedMarketplaces,
      channelStates: emptyChannelState(),
    }

    setProducts([createdProduct, ...products])
    setSelectedId(createdProduct.id)
    setSelectedMarketplace(selectedMarketplaces[0])
    setTitle('')
    setCategory('')
    setPrice('')
    setSelectedMarketplaces(['amazon', 'flipkart'])
  }

  function advanceProduct(productId: number, marketplace: Marketplace) {
    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id !== productId) {
          return product
        }

        const channel = product.channelStates[marketplace]

        if (channel.status === 'draft') {
          return {
            ...product,
            channelStates: {
              ...product.channelStates,
              [marketplace]: { ...channel, status: 'ready' },
            },
          }
        }

        if (channel.status === 'ready') {
          return {
            ...product,
            channelStates: {
              ...product.channelStates,
              [marketplace]: { ...channel, status: 'submitted' },
            },
          }
        }

        if (channel.status === 'submitted') {
          return {
            ...product,
            channelStates: {
              ...product.channelStates,
              [marketplace]: { ...channel, status: 'active' },
            },
          }
        }

        if (channel.promotionStatus === 'not_started') {
          return {
            ...product,
            channelStates: {
              ...product.channelStates,
              [marketplace]: { ...channel, promotionStatus: 'scheduled' },
            },
          }
        }

        if (channel.promotionStatus === 'scheduled') {
          return {
            ...product,
            channelStates: {
              ...product.channelStates,
              [marketplace]: { ...channel, promotionStatus: 'live' },
            },
          }
        }

        return product
      }),
    )
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
            Multi-marketplace seller workflow
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
            Ecommerce Control Center
          </h1>
          <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300 sm:text-lg">
            Manage catalog drafts, listing readiness, marketplace submission,
            and promotion launch for Amazon, Flipkart, and Meesho from one
            React dashboard.
          </p>
        </div>
        <div
          className="grid gap-4 md:grid-cols-3"
          aria-label="Marketplace summary"
        >
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Active listings
            </span>
            <strong className="mt-3 block text-3xl font-bold text-slate-900 dark:text-slate-50">
              {metrics.active}
            </strong>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Pending listings
            </span>
            <strong className="mt-3 block text-3xl font-bold text-slate-900 dark:text-slate-50">
              {metrics.pending}
            </strong>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Live promotions
            </span>
            <strong className="mt-3 block text-3xl font-bold text-slate-900 dark:text-slate-50">
              {metrics.promoted}
            </strong>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mb-5">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Step-by-step workflow
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Build and test the business flow before connecting the Python
            services.
          </p>
        </div>
        <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
          {workflowSteps.map((step, index) => (
            <article
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60"
              key={step.title}
            >
              <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                Step {index + 1}
              </span>
              <h3 className="mt-3 mb-2 text-lg font-semibold text-slate-900 dark:text-slate-50">
                {step.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{step.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-5">
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
              Add product draft
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Create a product locally, choose the sales channels, then move
              each listing through its own lifecycle.
            </p>
          </div>
          <form className="grid gap-4" onSubmit={addProduct}>
            <label className="grid gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              Product title
              <input
                aria-label="Product title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Wireless speaker"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              Category
              <input
                aria-label="Category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Electronics"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
              Price
              <input
                aria-label="Price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                type="number"
                min="0"
                step="0.01"
                placeholder="49.99"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
              />
            </label>
            <fieldset className="grid gap-3">
              <legend className="text-sm font-medium text-slate-900 dark:text-slate-100">
                Listing channels
              </legend>
              <div className="grid gap-2">
                {marketplaceOptions.map((marketplace) => (
                  <label
                    key={marketplace}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMarketplaces.includes(marketplace)}
                      onChange={() => toggleMarketplace(marketplace)}
                      aria-label={marketplaceLabel(marketplace)}
                    />
                    <span>{marketplaceLabel(marketplace)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <button
              type="submit"
              className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              Add product
            </button>
          </form>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mb-5">
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
              Products queue
            </h2>
            <p className="text-slate-600 dark:text-slate-300">
              Select a product and manage its listing status separately for each
              marketplace.
            </p>
          </div>
          <div className="grid gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`flex w-full flex-col justify-between gap-4 rounded-2xl border p-4 text-left transition md:flex-row ${
                  selectedProduct?.id === product.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-sm dark:bg-indigo-500/10'
                    : 'border-slate-200 bg-slate-50 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-950/60'
                }`}
                onClick={() => setSelectedId(product.id)}
              >
                <div>
                  <strong className="mb-1 block text-base text-slate-900 dark:text-slate-50">
                    {product.title}
                  </strong>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {product.category} • {product.sku}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.marketplaces.map((marketplace) => (
                      <span
                        key={marketplace}
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeTone(
                          marketplace,
                        )}`}
                      >
                        {marketplaceLabel(marketplace)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid justify-items-start gap-2 md:justify-items-end">
                  <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                    {
                      product.marketplaces.filter(
                        (marketplace) => product.channelStates[marketplace].status === 'active',
                      ).length
                    }{' '}
                    active
                  </span>
                  <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {
                      product.marketplaces.filter(
                        (marketplace) =>
                          product.channelStates[marketplace].promotionStatus === 'live',
                      ).length
                    }{' '}
                    promotions live
                  </span>
                </div>
              </button>
            ))}
          </div>
        </article>
      </section>

      {selectedProduct && selectedChannel && activeMarketplace ? (
        <section className="pb-3">
          <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
            <div className="mb-5">
              <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
                {selectedProduct.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                {selectedProduct.category} • {selectedProduct.sku} • ${selectedProduct.price.toFixed(2)}
              </p>
            </div>
            <div className="mb-5 flex flex-wrap gap-3">
              {selectedProduct.marketplaces.map((marketplace) => (
                <button
                  key={marketplace}
                  type="button"
                  onClick={() => setSelectedMarketplace(marketplace)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeMarketplace === marketplace
                      ? `${badgeTone(marketplace)} ring-2 ring-offset-2 ring-slate-200 dark:ring-slate-700`
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                  }`}
                >
                  {marketplaceLabel(marketplace)}
                </button>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {marketplaceLabel(activeMarketplace)} listing status
                </h3>
                <ul className="grid gap-3 pl-5">
                  <li
                    className={
                      selectedChannel.status !== 'draft'
                        ? 'font-semibold text-slate-900 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-300'
                    }
                  >
                    Catalog draft created
                  </li>
                  <li
                    className={
                      selectedChannel.status === 'ready' ||
                      selectedChannel.status === 'submitted' ||
                      selectedChannel.status === 'active'
                        ? 'font-semibold text-slate-900 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-300'
                    }
                  >
                    Listing marked ready
                  </li>
                  <li
                    className={
                      selectedChannel.status === 'submitted' ||
                      selectedChannel.status === 'active'
                        ? 'font-semibold text-slate-900 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-300'
                    }
                  >
                    Submitted to {marketplaceLabel(activeMarketplace)}
                  </li>
                  <li
                    className={
                      selectedChannel.status === 'active'
                        ? 'font-semibold text-slate-900 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-300'
                    }
                  >
                    Active on {marketplaceLabel(activeMarketplace)}
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {marketplaceLabel(activeMarketplace)} promotion status
                </h3>
                <ul className="grid gap-3 pl-5">
                  <li
                    className={
                      selectedChannel.status === 'active'
                        ? 'font-semibold text-slate-900 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-300'
                    }
                  >
                    Ready for ad launch
                  </li>
                  <li
                    className={
                      selectedChannel.promotionStatus === 'scheduled' ||
                      selectedChannel.promotionStatus === 'live'
                        ? 'font-semibold text-slate-900 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-300'
                    }
                  >
                    Campaign scheduled
                  </li>
                  <li
                    className={
                      selectedChannel.promotionStatus === 'live'
                        ? 'font-semibold text-slate-900 dark:text-slate-50'
                        : 'text-slate-600 dark:text-slate-300'
                    }
                  >
                    Campaign live
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${badgeTone(
                    activeMarketplace,
                  )}`}
                >
                  {marketplaceLabel(activeMarketplace)}
                </span>
                <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                  {statusLabel(selectedChannel.status, activeMarketplace)}
                </span>
                <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Promotion: {promotionLabel(selectedChannel.promotionStatus)}
                </span>
              </div>
              <button
                type="button"
                className="rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => advanceProduct(selectedProduct.id, activeMarketplace)}
                disabled={nextAction(selectedChannel, activeMarketplace) === 'Promotion live'}
              >
                {nextAction(selectedChannel, activeMarketplace)}
              </button>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                This demo keeps state in the browser so each marketplace flow
                can be tested before the Python microservices are connected.
              </p>
            </div>
          </article>
        </section>
      ) : null}
    </main>
  )
}

export default App

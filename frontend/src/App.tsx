import { useEffect, useMemo, useState } from 'react'

import { ImageUploadSection } from './components/ImageUploadSection'
import { AmazonCatalogBlock } from './components/marketplace/AmazonCatalogBlock'
import { FlipkartCatalogBlock } from './components/marketplace/FlipkartCatalogBlock'
import { MeeshoCatalogBlock } from './components/marketplace/MeeshoCatalogBlock'
import { PlatformPicker } from './components/PlatformPicker'
import { ServiceConnections } from './ServiceConnections'
import type { Marketplace, Product, UploadedImage } from './types/marketplace'
import { emptyChannelState, marketplaceLabel } from './utils/marketplace'

const initialProducts: Product[] = [
  {
    id: 1,
    title: 'Noise Cancelling Headphones',
    category: 'Electronics',
    price: 129.99,
    sku: 'AMZ-HDPHN-001',
    imageUrls: [],
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
    imageUrls: [],
    marketplaces: ['amazon', 'meesho'],
    channelStates: {
      amazon: { status: 'submitted', promotionStatus: 'not_started' },
      flipkart: { status: 'draft', promotionStatus: 'not_started' },
      meesho: { status: 'ready', promotionStatus: 'not_started' },
    },
  },
]

function createImageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedId, setSelectedId] = useState<number>(initialProducts[0].id)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<Marketplace[]>([
    'amazon',
    'flipkart',
  ])

  const selectedProduct = products.find((product) => product.id === selectedId) ?? products[0]

  const activeMarketplaces = useMemo(() => {
    if (!selectedProduct) {
      return selectedMarketplaces
    }

    return selectedProduct.marketplaces
  }, [selectedProduct, selectedMarketplaces])

  useEffect(() => {
    return () => {
      for (const image of uploadedImages) {
        URL.revokeObjectURL(image.previewUrl)
      }
    }
  }, [uploadedImages])

  function addImages(files: FileList | File[]) {
    const nextFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))

    if (nextFiles.length === 0) {
      return
    }

    const additions: UploadedImage[] = nextFiles.map((file) => ({
      id: createImageId(),
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setUploadedImages((current) => [...current, ...additions])
  }

  function removeImage(id: string) {
    setUploadedImages((current) => {
      const target = current.find((image) => image.id === id)
      if (target) {
        URL.revokeObjectURL(target.previewUrl)
      }

      return current.filter((image) => image.id !== id)
    })
  }

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

  function saveProductDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !category.trim() || !price.trim() || selectedMarketplaces.length === 0) {
      return
    }

    const imageUrls = uploadedImages.map((image) => image.previewUrl)
    const createdProduct: Product = {
      id: Date.now(),
      title: title.trim(),
      category: category.trim(),
      price: Number(price),
      sku: `SKU-${category.slice(0, 4).toUpperCase()}-${products.length + 100}`,
      imageUrls,
      marketplaces: selectedMarketplaces,
      channelStates: emptyChannelState(),
    }

    setProducts([createdProduct, ...products])
    setSelectedId(createdProduct.id)
    setTitle('')
    setCategory('')
    setPrice('')
    setUploadedImages([])
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

  const draftImageUrls =
    uploadedImages.length > 0 ? uploadedImages.map((image) => image.previewUrl) : selectedProduct.imageUrls

  const catalogProduct: Product = {
    ...selectedProduct,
    title: title.trim() || selectedProduct.title,
    category: category.trim() || selectedProduct.category,
    price: price.trim() ? Number(price) : selectedProduct.price,
    imageUrls: draftImageUrls,
    marketplaces: selectedMarketplaces.length > 0 ? selectedMarketplaces : selectedProduct.marketplaces,
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
          Multi-marketplace seller workflow
        </p>
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Seller Catalog Hub
        </h1>
        <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
          Upload product images, choose your sales channels, then complete each marketplace catalog
          flow in its native seller UI.
        </p>
      </section>

      <ImageUploadSection
        images={uploadedImages}
        onAddImages={addImages}
        onRemoveImage={removeImage}
      />

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Product details</h2>
          <p className="mt-2 text-slate-600">
            These fields populate the Amazon, Flipkart, and Meesho catalog blocks below.
          </p>
        </div>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={saveProductDraft}>
          <label className="grid gap-2 text-sm font-medium text-slate-900">
            Product title
            <input
              aria-label="Product title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Wireless speaker"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-900">
            Category
            <input
              aria-label="Product category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Electronics"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-900">
            Price
            <input
              aria-label="Price"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              type="number"
              min="0"
              step="0.01"
              placeholder="49.99"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500"
            >
              Save product draft
            </button>
          </div>
        </form>
      </section>

      <PlatformPicker selected={selectedMarketplaces} onToggle={toggleMarketplace} />

      <section className="grid gap-6">
        {activeMarketplaces.includes('amazon') ? (
          <AmazonCatalogBlock
            product={catalogProduct}
            channel={selectedProduct.channelStates.amazon}
            onAdvance={() => advanceProduct(selectedProduct.id, 'amazon')}
          />
        ) : null}

        {activeMarketplaces.includes('flipkart') ? (
          <FlipkartCatalogBlock
            product={catalogProduct}
            channel={selectedProduct.channelStates.flipkart}
            onAdvance={() => advanceProduct(selectedProduct.id, 'flipkart')}
          />
        ) : null}

        {activeMarketplaces.includes('meesho') ? (
          <MeeshoCatalogBlock
            product={catalogProduct}
            channel={selectedProduct.channelStates.meesho}
            onAdvance={() => advanceProduct(selectedProduct.id, 'meesho')}
          />
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Saved products</h2>
          <p className="mt-2 text-slate-600">Switch between drafts to manage each marketplace flow.</p>
        </div>
        <div className="grid gap-3">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              className={`flex w-full flex-col justify-between gap-4 rounded-2xl border p-4 text-left transition md:flex-row ${
                selectedProduct.id === product.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                  : 'border-slate-200 bg-slate-50 hover:border-indigo-300'
              }`}
              onClick={() => {
                setSelectedId(product.id)
                setSelectedMarketplaces(product.marketplaces)
              }}
            >
              <div>
                <strong className="mb-1 block text-base text-slate-900">{product.title}</strong>
                <p className="text-sm text-slate-600">
                  {product.category} • {product.sku}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.marketplaces.map((marketplace) => (
                    <span
                      key={marketplace}
                      className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {marketplaceLabel(marketplace)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-sm text-slate-600">
                {product.imageUrls.length} image{product.imageUrls.length === 1 ? '' : 's'}
              </div>
            </button>
          ))}
        </div>
      </section>

      <ServiceConnections />
    </main>
  )
}

export default App

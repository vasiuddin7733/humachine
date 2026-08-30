export type Marketplace = 'amazon' | 'flipkart' | 'meesho'
export type ProductStatus = 'draft' | 'ready' | 'submitted' | 'active'
export type PromotionStatus = 'not_started' | 'scheduled' | 'live'

export type ChannelState = {
  status: ProductStatus
  promotionStatus: PromotionStatus
}

export type Product = {
  id: number
  title: string
  category: string
  price: number
  sku: string
  imageUrls: string[]
  marketplaces: Marketplace[]
  channelStates: Record<Marketplace, ChannelState>
}

export type UploadedImage = {
  id: string
  file: File
  previewUrl: string
}

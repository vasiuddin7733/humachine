import type { ChannelState, Marketplace, ProductStatus, PromotionStatus } from '../types/marketplace'

export const marketplaceOptions: Marketplace[] = ['amazon', 'flipkart', 'meesho']

export function emptyChannelState(): Record<Marketplace, ChannelState> {
  return {
    amazon: { status: 'draft', promotionStatus: 'not_started' },
    flipkart: { status: 'draft', promotionStatus: 'not_started' },
    meesho: { status: 'draft', promotionStatus: 'not_started' },
  }
}

export function marketplaceLabel(marketplace: Marketplace) {
  switch (marketplace) {
    case 'amazon':
      return 'Amazon'
    case 'flipkart':
      return 'Flipkart'
    case 'meesho':
      return 'Meesho'
  }
}

export function nextAction(channelState: ChannelState, marketplace: Marketplace) {
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

export function statusLabel(status: ProductStatus, marketplace: Marketplace) {
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

export function promotionLabel(status: PromotionStatus) {
  switch (status) {
    case 'not_started':
      return 'Not started'
    case 'scheduled':
      return 'Scheduled'
    case 'live':
      return 'Live'
  }
}

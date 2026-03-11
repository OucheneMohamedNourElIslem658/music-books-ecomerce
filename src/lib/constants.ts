export type SortFilterItem = {
  reverse: boolean
  slug: null | string
  title: string
}

export const defaultSort: SortFilterItem = {
  slug: null,
  reverse: false,
  title: 'shop.filter.sort.alphabetical',
}

export const sorting: SortFilterItem[] = [
  defaultSort,
  { slug: '-createdAt', reverse: true, title: 'shop.filter.sort.latest' },
  { slug: 'priceInUSD', reverse: false, title: 'shop.filter.sort.priceLowHigh' }, // asc
  { slug: '-priceInUSD', reverse: true, title: 'shop.filter.sort.priceHighLow' },
]

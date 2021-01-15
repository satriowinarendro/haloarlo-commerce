import type { ProductNode } from '@framework/api/operations/get-product'
import { ProductOption, SelectedOptions } from '@lib/data/products'

// Returns the available options of a product
export function getProductOptions(product: ProductNode) {
  const options = product.productOptions.edges?.reduce<ProductOption[]>(
    (arr, edge) => {
      if (edge?.node.__typename === 'MultipleChoiceOption') {
        arr.push({
          displayName: edge.node.displayName.toLowerCase(),
          values: edge.node.values.edges?.map((edge) => edge?.node),
        })
      }
      return arr
    },
    []
  )

  return options
}

// Finds a variant in the product that matches the selected options
export function getCurrentVariant(product: ProductNode, opts: SelectedOptions) {
  const variant = product.variants.edges?.find((edge) => {
    const { node } = edge ?? {}

    return Object.entries(opts).every(([key, value]) =>
      node?.productOptions.edges?.find((edge) => {
        if (
          edge?.node.__typename === 'MultipleChoiceOption' &&
          edge.node.displayName.toLowerCase() === key
        ) {
          return edge.node.values.edges?.find(
            (valueEdge) => valueEdge?.node.label === value
          )
        }
      })
    )
  })

  return variant
}

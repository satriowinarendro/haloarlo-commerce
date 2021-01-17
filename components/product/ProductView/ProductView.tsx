import { FC, useMemo, useState } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import { NextSeo } from 'next-seo'

import s from './ProductView.module.css'
import { useUI } from '@components/ui/context'
import { Swatch, ProductSlider } from '@components/product'
import { Button, Container, Text } from '@components/ui'

import { getStockForACombination, VariantCombination } from "@lib/data/products"
import WishlistButton from '@components/wishlist/WishlistButton'
import { createProductOptions, ProductContent } from '@lib/data/products'
import { addToCart } from '@lib/data/cart'
import { Layout } from '@components/common'

interface Props { 
  className?: string
  children?: any
  product: ProductContent
}

const ProductView: FC<Props> = ({ product, children }) => {
  const options = createProductOptions(product)
  const { openSidebar } = useUI()
  const [loading, setLoading] = useState(false)
  const [choices, setChoices] = useState<VariantCombination>({
    size: options[1].values[0].label,
    color: options[0].values[0].label,
  })
  const stock = useMemo(() => getStockForACombination(product.variants, {size: choices.size, color: choices.color}), [product, choices]);
  const isOutOfStock = stock === "0";

  const renderStock = () => {
    return (
      <span className={cn(isOutOfStock && "text-red font-extrabold")}>
        {isOutOfStock ? "Out of stock" : stock}
      </span>
    );
  }

  return (
    <Container className="max-w-none w-full" clean>
      <NextSeo
        title={product.name}
        description={product.description}
        openGraph={{
          type: 'website',
          title: product.name,
          description: product.description,
          images: [
            {
              url: product.images && product.images[0] || "",
              width: 800,
              height: 600,
              alt: product.name,
            },
          ],
        }}
      />
      <div className={cn(s.root, 'fit')}>
        <div className={cn(s.productDisplay, 'fit')}>
          <div className={s.nameBox}>
            <h1 className={s.name}>{product.name}</h1>
            <div className={s.price}>
              {product.price}
              {` `}
              {"IDR"}
            </div>
          </div>

          <div className={s.sliderContainer}>
            <ProductSlider key={product.slug}>
              {product.images?.map((image, i) => (
                <div key={image} className={s.imageContainer}>
                  <Image
                    className={s.img}
                    src={image}
                    alt={image || 'Product Image'}
                    width={1050}
                    height={1050}
                    priority={i === 0}
                    quality="85"
                  />
                </div>
              ))}
            </ProductSlider>
          </div>
        </div>

        <div className={s.sidebar}>
          <section>
            {options.map((opt: any) => (
              <div className="pb-4" key={opt.displayName}>
                <h2 className="uppercase font-medium">{opt.displayName}</h2>
                <div className="flex flex-row py-4">
                  {opt.values?.map((v: any, i: number) => {
                    const active = (choices as any)[opt.displayName]

                    return (
                      <Swatch
                        key={`${v.entityId}-${i}`}
                        active={v.label === active}
                        color={v.hexColors ? v.hexColors[0] : ''}
                        label={v.label}
                        onClick={() => {
                          setChoices((choices) => {
                            return {
                              ...choices,
                              [opt.displayName]: v.label,
                            }
                          })
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
            <div className="pb-4">
              <h2 className="uppercase font-medium">Available Stock:</h2>
              <div className="py-4">{renderStock()}</div>
            </div>
            <div className="pb-10 break-words w-full max-w-xl">
                {children}
            </div>
          </section>
          <div>
            <Button
              aria-label="Add to Cart"
              type="button"
              className={s.button}
              onClick={async () => {
                addToCart(product, choices);
                setLoading(true)
                await new Promise(resolve => setTimeout(resolve, 500))
                openSidebar();
                setLoading(false)
              }}
              loading={loading}
              disabled={!choices.color || !choices.size || isOutOfStock}

            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* <WishlistButton
          className={s.wishlistButton}
          productId={product.entityId}
          variant={product.variants.edges?.[0]!}
        /> */}
      </div>
    </Container>
  )
}

ProductView.Layout = Layout;

export default ProductView

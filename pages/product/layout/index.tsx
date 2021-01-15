import { useRouter } from 'next/router'
import { Layout } from '@components/common'
import { ProductView } from '@components/product'

export default function Slug({frontMatter: product, children}: any) {
  const router = useRouter()

  return (
    <Layout pageProps={{}}>
      {router.isFallback ? (
        <h1>Loading...</h1> // TODO (BC) Add Skeleton Views
      ) : (
        <ProductView product={product}>
          {children}
        </ProductView>
      )}
    </Layout>
  )
}
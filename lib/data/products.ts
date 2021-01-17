import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const productsDirectory = path.join(process.cwd(), "pages/product");

export interface ProductContent{
  date: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  variants: string[];
  tags?: string[];
  shopeeURL?: string;
  whatsappText?: string;
  images?: string[];
};

export interface ProductOption{
  displayName: string
  values: any
}

export interface VariantCombination{
  size: string
  color: string
}

export interface Stock extends VariantCombination{
  stock: string
}

let productCache: ProductContent[];

function fetchProductContent(): ProductContent[] {
  if (productCache) {
    return productCache;
  }
  // Get file names under /products
  const fileNames = fs.readdirSync(productsDirectory);
  const allProductsData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(productsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the product metadata section
      const matterResult = matter(fileContents, {
        engines: {
          yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }) as object,
        },
      });
      const matterData = matterResult.data as ProductContent;
      const slug = fileName.replace(/\.mdx$/, "");

      // Validate slug string
      if (matterData.slug !== slug) {
        throw new Error(
          "slug field not match with the path of its content source"
        );
      }

      return matterData;
    });
  // Sort product by date
  productCache = allProductsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return productCache;
}

export function countProducts(tag?: string): number {
  return fetchProductContent().filter(
    (it) => !tag || (it.tags && it.tags.includes(tag))
  ).length;
}

export function listProductContent(
  page: number,
  limit: number,
  tag?: string
): ProductContent[] {
  return fetchProductContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}

export function getStocks(variants: string[]): Stock[]{
  return variants.map((variant) => {
    const [size,color,stock] = variant.split(":");
    return {
      size,
      color,
      stock
    }
  });
}

export function getStockForACombination(variants: string[], {size, color}: VariantCombination): string | null{
  const stocks = getStocks(variants);
  const item: Stock | undefined = stocks.find((stock) => (stock.size === size) && (stock.color === color));
  return item ? item.stock : null;
}

export function getUniqueSizesAndColors(variants: string[]): {
  sizes: Set<string>,
  colors: Set<string>,
}{
  const stocks = getStocks(variants);
  const sizes = new Set<string>();
  const colors = new Set<string>();
  stocks.map((variant) => {
    sizes.add(variant.size);
    colors.add(variant.color);
  });
  return {
    sizes,
    colors,
  }
}

export function createProductOptions(product: ProductContent): ProductOption[]{
  const {sizes, colors} = getUniqueSizesAndColors(product.variants);
  return [
    {
      displayName: "color",
      values: [...colors].map((color) => ({
        entityId: color,
        hexColors: "",
        label: color,
      }))
    },
    {
      displayName: "size",
      values: [...sizes].map((size) => ({
        entityId: size,
        hexColors: "",
        label: size,
      }))
    }

  ]
}
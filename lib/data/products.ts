import fs from "fs";
import matter from "gray-matter";
import path from "path";
import yaml from "js-yaml";

const productsDirectory = path.join(process.cwd(), "pages/product");

export type ProductContent = {
  date: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  colors: string[];
  sizes: string[];
  tags?: string[];
  shopeeURL?: string;
  whatsappText?: string;
  images?: string[];
};

export type SelectedOptions = {
  size: string;
  color: string;
};

export type ProductOption = {
  displayName: string
  values: any
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

export function createProductOptions(product: ProductContent): ProductOption[]{
  return [
    {
      displayName: "color",
      values: product?.colors?.map((color) => ({
        entityId: color,
        hexColors: "",
        label: color,
      }))
    },
    {
      displayName: "size",
      values: product?.sizes?.map((size) => ({
        entityId: size,
        hexColors: "",
        label: size,
      }))
    }

  ]
}
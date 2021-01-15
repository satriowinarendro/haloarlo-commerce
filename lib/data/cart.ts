import { Cart } from "@framework/api/cart";
import extendedStorage from "@lib/extendedStorage";
import { ProductContent, SelectedOptions } from "./products";

const CART_STORAGE_KEY = "cart"

interface CartItem {
    name: string;
    size: string;
    color: string;
}
export function addToCart(product: ProductContent, choices: SelectedOptions){
    if (extendedStorage) {
        const existingItems: CartItem[] | undefined = extendedStorage.localStorage.getObject(CART_STORAGE_KEY)
        const newEntry: CartItem = {
            name: product.name,
            size: choices.size,
            color: choices.color
        }
        const sameItemExist = !!existingItems?.find((item) => {
            return (item.name === newEntry.name) && (item.size === newEntry.size) && (item.color === newEntry.color)
        })
        extendedStorage.localStorage.setObject(CART_STORAGE_KEY, existingItems ? [...existingItems, newEntry] : [newEntry]);
        // TODO: finalize how to maintain stock and cart
    }
}

export function removeFromCart(product: ProductContent){
    if (extendedStorage) {
        const existingItems: ProductContent[] | undefined = extendedStorage.localStorage.getObject(CART_STORAGE_KEY)
        if (!existingItems) {
            console.error("CART'S EMPTY");
            return;
        }
        const updatedItems: ProductContent[] = existingItems?.slice(existingItems.findIndex((item) => item.slug === product.slug), 1)
        extendedStorage.localStorage.setObject(CART_STORAGE_KEY, updatedItems);
    }
}
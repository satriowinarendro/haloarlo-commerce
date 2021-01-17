import cart, { Cart } from "@framework/api/cart";
import extendedStorage from "@lib/extendedStorage";
import { getStockForACombination, Stock, VariantCombination } from "@lib/data/products";
import { ProductContent } from "./products";

const CART_STORAGE_KEY = "cart"

export interface CartItem{
    slug: string;
    size: string;
    color: string;
    quantity: number;
    snapshot: ProductContent;
}

export function getCurrentCart(){
    if (!extendedStorage) return;
    return extendedStorage.localStorage.getObject(CART_STORAGE_KEY)
}

export function setItemToCart(cartItems: CartItem[]){
    if (!extendedStorage) return;
    return extendedStorage.localStorage.setObject(CART_STORAGE_KEY, cartItems)
}

export function getTotalCartPrice(){
    const cartItems = getCurrentCart();
    return `IDR ${cartItems.reduce((total: number, item: CartItem) => total + (item.snapshot.price * item.quantity), 0)}`;
}

export function isCartEmpty(){
    const cartItems = getCurrentCart();
    return !cartItems;
}

export function isProductInCart({product, variant}: {product: ProductContent, variant: VariantCombination}){
    if (!extendedStorage) return;
    const cartItems = getCurrentCart();
    if (!cartItems) return false;
    return !!cartItems.find((item: CartItem) => (item.slug === product.slug) && (item.size === variant.size) && (item.color === variant.color));
}

export function addToCart(product: ProductContent, variant: VariantCombination){
    if (!extendedStorage) return;
    const cartItems: CartItem[] = getCurrentCart();
    const newEntry: CartItem = {
        slug: product.slug,
        size: variant.size,
        color: variant.color,
        quantity: 1,
        snapshot: product,
    }
    let updatedItems: CartItem[];
    if(!cartItems){
        updatedItems = [newEntry];
    } else if (isProductInCart({product, variant})){
        updatedItems = cartItems.map((item: CartItem) => {
            if ((item.slug === product.slug) && (item.size === variant.size) && (item.color === variant.color)) {
                item.quantity += 1;
            }
            return item
        })
    } else {
        updatedItems = [
            ...cartItems,
            newEntry
        ]
    }
    setItemToCart(updatedItems);
}

export function removeFromCart(cartItem: CartItem){
    const cartItems = getCurrentCart();
    const filtered = cartItems.filter((item: CartItem) => !((item.slug === cartItem.slug) && (item.size === cartItem.size) && (item.color === cartItem.color)))
    setItemToCart(filtered);
}

export function adjustCartItemQuantityByOne({cartItem, action}: {cartItem: CartItem, action: "increase" | "decrease"}){
    const cartItems = getCurrentCart();
    const updatedCart = cartItems.map((item: CartItem) => {
        if ((item.slug === cartItem.slug) && (item.size === cartItem.size) && (item.color === cartItem.color)) {
            const availableStock = getStockForACombination(item.snapshot.variants, {size: item.size, color: item.color})
            if (action === "increase" && item.quantity < Number(availableStock)) {
                item.quantity += 1
            }
            if (action === "decrease" && item.quantity > 1) {
                item.quantity -= 1
            }
        }
        return item;
    })
    setItemToCart(updatedCart)
}
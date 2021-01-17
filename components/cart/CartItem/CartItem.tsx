import { ChangeEvent, useEffect, useState, useCallback } from 'react'
import cn from 'classnames'
import Image from 'next/image'
import Link from 'next/link'
import { Trash, Plus, Minus } from '@components/icons'
import s from './CartItem.module.css'
import { adjustCartItemQuantityByOne, CartItem, removeFromCart } from '@lib/data/cart'

const CartItemComponent = ({
  item,
  forceRerenderCart,
}: {
  item: CartItem,
  forceRerenderCart: () => any;
}) => {
  return (
    <li
      className={cn('flex flex-row space-x-8 py-8')}
    >
      <div className="w-16 h-16 bg-violet relative overflow-hidden">
        <Image
          className={s.productImage}
          src={item.snapshot.images ? item.snapshot.images[0] : ""}
          width={150}
          height={150}
          alt="Product Image"
          // The cart item image is already optimized and very small in size
          unoptimized
        />
      </div>
      <div className="flex-1 flex flex-col text-base">
        {/** TODO: Replace this. No `path` found at Cart */}
        <Link href={`/product/${item.slug}`}>
          <span className="font-bold mb-5 text-lg cursor-pointer">
            {item.snapshot.name}
          </span>
        </Link>
        <div className="text-sm">
          Size : {item.size}<br/>
          Color : {item.color}
        </div>
        <div className="flex items-center">
          <button type="button" onClick={() => {
              adjustCartItemQuantityByOne({cartItem: item, action: "decrease"});
              forceRerenderCart();
            }}>
            <Minus width={18} height={18} />
          </button>
          <label>
            <input
              type="number"
              max={99}
              min={0}
              className={s.quantity}
              value={item.quantity}
              disabled={true}
            />
          </label>
          <button type="button" onClick={() => {
              adjustCartItemQuantityByOne({cartItem: item, action: "increase"});
              forceRerenderCart();
            }}>
            <Plus width={18} height={18} />
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between space-y-2 text-base">
        <span>{item.snapshot.price}</span>
        <button className="flex justify-end" onClick={() => {
            removeFromCart(item);
            forceRerenderCart();
          }}>
          <Trash />
        </button>
      </div>
    </li>
  )
}

export default CartItemComponent

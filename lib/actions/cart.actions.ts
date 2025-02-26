"use server";

import { CartItem } from "@/types";
import { cookies } from "next/headers";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

//calculate cart prices

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addItemToCart(data: CartItem) {
  try {
    //check for cart cookies
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) {
      throw new Error("Session cart id not found");
    }

    //get session and user id

    const session = await auth();

    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();

    // Parse and validate item

    const item = cartItemSchema.parse(data);

    // find product in database

    const product = await prisma.product.findFirst({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (!cart) {
      // create new cart obj
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId,
        ...calcPrice([item]),
      });

      //add to database
      await prisma.cart.create({
        data: newCart,
      });

      //Revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // check if item already exists in cart
      const existingItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );
      if (existingItem) {
        //check stock
        if (product.stock < Number(existingItem.qty) + 1) {
          throw new Error("Not enough stock");
        }

        //update item quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.qty = existingItem.qty + 1;
      } else {
        // if item does not exist in cart
        //check stock
        if (product.stock < 1) {
          throw new Error("Not enough stock");
        }
        //add item to cart
        cart.items.push(item);
      }
      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items as Prisma.CartUpdateInput["items"],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existingItem ? "updated" : "added"
        } to cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  //check for cart cookies
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("Session cart id not found");
  }

  //get session and user id

  const session = await auth();

  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  //get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) {
    return undefined;
  }

  // convertToPlainObject

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

export async function removeItemFromCart(productId: string) {
  try {
    // check for cart cookies
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartId) {
      throw new Error("Session cart id not found");
    }
    //get product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }
    //get user cart from database
    const cart = await getMyCart();
    if (!cart) {
      throw new Error("Cart not found");
    }

    // check for item
    const exist = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!exist) {
      throw new Error("Item not found in cart");
    }

    // check if only one in qty
    if (exist.qty === 1) {
        //remove from cart
        cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId);
    } else{
        //decrease qty
        (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = exist.qty - 1;
    }

    // update cart in database

    await prisma.cart.update({
        where: {
            id: cart.id,
        },
        data: {
            items: cart.items as Prisma.CartUpdateInput["items"],
            ...calcPrice(cart.items as CartItem[]),
        },
    })

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Cart, CartItem } from "@/types";
import { Plus, Minus, Loader } from "lucide-react";
import { toast } from "sonner"; // <-- Changed this import
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

const AddToCart = ({ item, cart }: { cart?: Cart; item: CartItem }) => {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast.error(res.message, {
          style: {
            backgroundColor: "red",
          },
        }); // Changed to use toast.error (dot notation)

        return;
      }

      toast.success(res.message, {
        // Changed to use toast.success (dot notation)

        action: {
          label: "Go to Cart",

          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  //handle remove item from cart
  const handleRemoveItemFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      if (!res.success) {
        toast.error(res.message, {
          style: {
            backgroundColor: "red",
          },
        }); // Changed to use toast.error (dot notation)

        return;
      }
      toast.success(res.message, {
        // Changed to use toast.success (dot notation)
        action: {
          label: "Go to Cart",

          onClick: () => router.push("/cart"),
        },
      });
    });
  };

  // check if item is in cart
  const existsItem =
    cart && cart.items.find((i) => i.productId === item.productId);
  return existsItem ? (
    <div>
      <Button
        type="button"
        variant={"outline"}
        onClick={handleRemoveItemFromCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="h-4 w-4" />
        )}
      </Button>
      <span className="px-2">{existsItem.qty}</span>
      <Button type="button" onClick={handleAddToCart} variant={"outline"}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}{" "}
      Add to Cart
    </Button>
  );
};

export default AddToCart;

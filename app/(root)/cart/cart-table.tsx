"use client";
import { Cart } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { removeItemFromCart, addItemToCart } from "@/lib/actions/cart.actions";
import { Minus, Plus, Loader, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const CartTable = ({ cart }: { cart?: Cart }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className="py-4 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty. <Link href="/">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">Table</div>
        </div>
      )}
    </>
  );
};

export default CartTable;

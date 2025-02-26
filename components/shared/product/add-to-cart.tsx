"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CartItem } from "@/types";
import { Plus } from "lucide-react";
import { toast } from "sonner"; // <-- Changed this import
import { addItemToCart } from "@/lib/actions/cart.actions";

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
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
  };
  return (
    <Button className="w-full" type="button" onClick={handleAddToCart}>
      <Plus/> Add to Cart
    </Button>
  );
};


export default AddToCart;

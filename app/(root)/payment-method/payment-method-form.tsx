"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { paymentMethodSchema } from "@/lib/validator";
import CheckoutSteps from "@/components/shared/checkout-steps";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEFAULT_PAYMENT_METHOD } from "@/lib/constants";

const PaymentMethodForm = ({
  preferredPaymentMethod,
}: {
  preferredPaymentMethod: string | null;
}) => {

    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const form = useForm<z.infer<typeof paymentMethodSchema>>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
        }
    })

    
  return (
    <>
      <CheckoutSteps current={2} />
    </>
  )
};

export default PaymentMethodForm;

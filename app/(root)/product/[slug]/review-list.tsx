"use client";
import { Review } from "@/types";
import Link from "next/link";
import { useState } from "react";

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No Reviews yet</div>}
      {userId ? (
        <>{/* {Review form here} */}</>
      ) : (
        <div>
          Please
          <Link
            className="text-blue-700 px-2"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            Sign In
          </Link>
          to write a review
        </div>
      )}
      <div className="flex flex-col gap-3">{/* {Review} */}</div>
    </div>
  );
};

export default ReviewList;

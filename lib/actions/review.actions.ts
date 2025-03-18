"use server";

import { z } from "zod";
import { insertReviewSchema } from "../validator";
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";

//create and update Reviews
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) {
      throw new Error("You must be logged in to create a review.");
    }
    //validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    //get product that the review is for

    const product = await prisma.product.findFirst({
      where: {
        id: review.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    //check if the user has already reviewed the product
    const reviewExists = await prisma.review.findFirst({
      where: {
        userId: review.userId,
        productId: review.productId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (reviewExists) {
        //update the review
        await tx.review.update({
          where: {
            id: reviewExists.id,
          },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        //create the review
        await tx.review.create({
          data: review,
        });
      }

      //get avg rating
      const avgRating = await tx.review.aggregate({
        where: {
          productId: review.productId,
        },
        _avg: {
          rating: true,
        },
      });
      //get number of reviews
      const numReviews = await tx.review.count({
        where: {
          productId: review.productId,
        },
      });

      //Update the rating and numReviews in the product
      await tx.product.update({
        where: {
          id: review.productId,
        },
        data: {
          rating: avgRating._avg.rating || 0,
          numReviews: numReviews,
        },
      });
    });

    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: "Review submitted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// get all reviews for a product
export async function getReviews({ productId }: { productId: string }) {
  const data = await prisma.review.findMany({
    where: {
      productId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { data };
}

// get a review by the current user
export async function getReviewByProductId({
  productId,
}: {
  productId: string;
}) {
  const session = await auth();

  if (!session) {
    throw new Error("User not authenticated.");
  }

  return await prisma.review.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
  });
}

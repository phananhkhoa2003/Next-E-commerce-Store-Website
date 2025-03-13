/**
 * @fileoverview This file contains server-side actions related to product management
 * in the Ecommerce Next.js application.
 *
 * @module lib/actions/product.actions
 *
 * @remarks
 * The 'use server' directive indicates that the code in this file is intended to be
 * executed on the server side.
 */
"use server";

import { prisma } from "@/db/prisma";

import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from "../constants";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import { insertProductSchema, updateProductSchema } from "../validator";
import { z } from "zod";

//Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: LATEST_PRODUCTS_LIMIT,
  });
  return convertToPlainObject(data);
}

// Get single product by it's slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: {
      slug,
    },
  });
}
// Get single product by it's id
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });
  return convertToPlainObject(data);
}

//get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category: string;
}) {
  const data = await prisma.product.findMany({
    orderBy:{ createdAt: "desc"},
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: {
        id,
      },
    })
    if (!productExists) {
      throw new Error("Product not found")
    }
    await prisma.product.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product deleted successfully",
    };
    
  } catch (error) {
    return{
      success: false,
      message:formatError(error),
    }
  }
}

// create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({data: product});

    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };


  }
}
// update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  
  try {
    const product = updateProductSchema.parse(data);
    
    const productExists = await prisma.product.findFirst({
      where: {
        id: product.id,
      },
    })

    if (!productExists) {
      throw new Error("Product not found")
    }
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });


    revalidatePath("/admin/products");
    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };


  }
}
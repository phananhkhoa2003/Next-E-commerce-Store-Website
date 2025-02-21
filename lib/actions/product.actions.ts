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
import { LATEST_PRODUCTS_LIMIT } from "../constants";

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
  })
}

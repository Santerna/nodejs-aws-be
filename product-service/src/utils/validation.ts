import { z } from 'zod';

export const ProductSchema = z.object({
  title: z.string().min(1).max(18),
  decription: z.string().min(1),
  count: z.number(),
  price: z.number(),
});

export type ProductData = typeof ProductSchema;

export const validateProductData = (data: ProductData) => {
    const isValidData = ProductSchema.parse(data);
    return isValidData;
};

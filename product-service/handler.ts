import * as handlers from './src';
import { LocalProductService } from './src/services/productService';

const productService = new LocalProductService();

export const getProductById = handlers.getProductById(productService);
export const getAllProducts = handlers.getProductsList(productService);
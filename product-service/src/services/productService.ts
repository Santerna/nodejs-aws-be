import { ProductService, Product } from './types';
import products from '../productData/productData.json'

export class LocalProductService implements ProductService {
  getProductById(id: string) {
      return Promise.resolve(products.find( product => product.id === id ));
  }

  getProductsList() {
      return Promise.resolve(products);
  }
}

export interface Product {
  count: number,
  description: string,
  price: number,
  id: string,
  title: string,
}

export interface ProductService {
  getProductById: (id: string) => Promise<Product | undefined>,
  getProductsList: () => Promise<Product[]>,
  createProduct: (productData: Product) => Promise<Product>,
}
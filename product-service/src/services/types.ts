export interface Product {
  id: string,
  title: string,
}

export interface ProductService {
  getProductById: (id: string) => Promise<Product | undefined>,
  getProductsList: () => Promise<Product[]>,
}
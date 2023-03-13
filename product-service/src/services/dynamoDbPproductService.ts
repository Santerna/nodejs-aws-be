import AWS from 'aws-sdk';
import {  DocumentClient } from 'aws-sdk/clients/dynamodb';
// import dotenv from 'dotenv';
import { ProductService, Product } from './types';


// dotenv.config();

export class DynamoDbProductService implements ProductService{

  private dynamoDb: DocumentClient;
  private productTable: string;
  private stockTable: string;
  constructor() {
    this.dynamoDb = new AWS.DynamoDB.DocumentClient({
      region: 'eu-central-1',
    });
    this.productTable = process.env.DYNAMODB_PRODUCTS_TABLE_NAME;
    this.stockTable = process.env.DYNAMODB_STOCK_TABLE_NAME;
  }

  async getProductsList(): Promise<Product[]> {
    console.log('Connecting to DB: productList');
    const params1 = {
      TableName: this.productTable,
    };

    const params2 = {
      TableName: this.stockTable,
    };
    
    const productsResult = await this.dynamoDb.scan(params1).promise();
    console.log('Database product list result', productsResult);
    if (!productsResult.Items) {
      return []
    }

    const products = productsResult.Items;

    const stockResult = await this.dynamoDb.scan(params2).promise();
    console.log('Database stock list result', stockResult);

    const stock = stockResult.Items;

    const productList = products.map(x => {
      let item = stock.find(item => item.product_id === x.id);
      if (item) { 
        return { count: item.count, ...x};
      }      
    }).filter(item => item !== undefined);

    return productList as Product[];
  };

  async getProductById(id: string): Promise<Product | null> {
    console.log('Connecting to DB: product')
    const params1 = {
      TableName: this.productTable,
      Key: { 'id': id },
    };

    const params2 = {
      TableName: this.stockTable,
      Key: { 'product_id': id },
    };

    try {
      console.log('Getting product');
      const productItem = await this.dynamoDb.get(params1, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
      }).promise();
      console.log('Database single product result', productItem);
      if (!productItem || !productItem.Item) {
        return null;
      }

      const stockItem = await this.dynamoDb.get(params2, function(err, data) {
        if (err) console.log(err);
        else console.log(data);
      }).promise();
      console.log('Stock single product result', stockItem);

      const product = productItem.Item;
      const count = stockItem.Item;
      console.log('Product item', product);
      return { ...product, count: count.count } as Product;
    } catch (error) {
      throw new Error(error);
    }
  };

  async createProduct(productData: Product): Promise<Product> {
    const putParams1 = {
      TableName: this.productTable,
      Item: {
        id: productData.id,
        description: productData.description,
        title: productData.title,
        price: productData.price,
      },
    };

    const putParams2 = {
      TableName: this.stockTable,
      Item: {
        product_id: productData.id,
        count: productData.count,
      },
    };

    const createdProduct = await this.dynamoDb.put(putParams1).promise();
    const stockProduct = await this.dynamoDb.put(putParams2).promise();
    console.log('Created product', createdProduct);
    console.log('Product in stock', stockProduct);

    const product = createdProduct.Attributes;
    const stock = stockProduct.Attributes;
    return { ...product, count: stock.count } as Product;
  };
};

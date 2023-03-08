import * as dotenv from 'dotenv';
import AWS, { DynamoDB } from "aws-sdk";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { ProductService, Product } from "./types";
import { GetItemInput, PutItemInput } from "@aws-sdk/client-dynamodb";
import { Converter } from "aws-sdk/clients/dynamodb";

export class DynamoDbProductService implements ProductService{

  private dynamodb = new AWS.DynamoDB.DocumentClient();
  dynamoDb: DynamoDB;
  constructor(tableName1: string) {
    this.dynamoDb = new DynamoDB({});
  }

  unmarshallList(items) {
    const unmarshalledItems = []
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        unmarshalledItems.push(unmarshall(item))
    }
    return unmarshalledItems
  }

  async getProductsList(): Promise<Product[]> {
    const params1 = {
      TableName: 'products-table',
    };

    const params2 = {
      TableName: 'stock-table',
    }
    
    const productsResult = await this.dynamodb.scan(params1).promise();
    console.log('Database product list result', productsResult);
    if (!productsResult.Items) {
      return []
    }

    const products = this.unmarshallList(productsResult.Items);

    const stockResult = await this.dynamoDb.scan(params2).promise();
    console.log('Database stock list result', stockResult);

    const stock = this.unmarshallList(stockResult.Items);

    const productList: Product[] = products.map(x => {
      let item = stock.find(item => item.product_id === x.id);
      if (item) { 
        return { count: item.count, ...x};
      }      
    }).filter(item => item !== undefined);

    return productList;
  }

  async getProductById(id: string): Promise<Product | null> {
    const params1: GetItemInput = {
      TableName: 'products-list',
      Key: marshall({ id: id })
    };

    const params2: GetItemInput = {
      TableName: 'stock-list',
      Key: marshall({ product_id: id })
    };

    const productItem = await this.dynamoDb.getItem(params1).promise();
    console.log('Database single product result', productItem);
    if (!productItem || !productItem.Item) {
      return null
    }

    const stockItem = await this.dynamoDb.getItem(params2).promise();
    console.log('Stock single product result', stockItem);

    const product = Converter.unmarshall(productItem.Item);
    const count = Converter.unmarshall(stockItem.Item);
    console.log('Product item', product);
    return { ...product, count: count.count } as Product;
  }

  async createProduct(productData: Product): Promise<Product> {
    const putParams1 = {
      TableName: process.env.DYNAMODB_PRODUCTS_TABLE_NAME,
      Item: marshall({
        id: productData.id,
        description: productData.description,
        title: productData.title,
        price: productData.price,
      }),
    };

    const putParams2 = {
      TableName: process.env.DYNAMODB_PRODUCTS_TABLE_NAME,
      Item: marshall({
        product_id: productData.id,
        count: productData.count,
      }),
    };

    const createdProduct = await this.dynamoDb.putItem(putParams1).promise();
    const stockProduct = await this.dynamoDb.putItem(putParams2).promise();
    console.log('Created product', createdProduct);
    console.log('Product in stock', stockProduct);

    const product = Converter.unmarshall(createdProduct.Attributes);
    const stock = Converter.unmarshall(stockProduct.Attributes)
    return { ...product, count: stock.count } as Product;
  };
}
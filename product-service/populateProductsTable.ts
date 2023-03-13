import AWS from 'aws-sdk';
import fs from 'fs';
import { Product } from 'services/types';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({region: 'eu-central-1'});

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const products: Product[] = JSON.parse(fs.readFileSync('./src/productData/productData.json', 'utf8'));

products.forEach(product => {
  const id = uuidv4();
  const params1 = {
    TableName: "products-table",
    Item: {
      "id": id,
      "title": product.title,
      "description": product.description,
      "price":  product.price,
    }
  };

  const params2 = {
    TableName: "stock-table",
    Item: {
      "product_id": id,
      "count": product.count,
    }
  };

  dynamoClient.put(params1, function(err, data) {
    if (err) {
      console.error("Unable to add product", product.title, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", { product: product.title, data });
    }
  });

  dynamoClient.put(params2, function(err, data) {
    if (err) {
      console.error("Unable to add product", id, ". Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded:", { product: id, data });
    }
  });
});

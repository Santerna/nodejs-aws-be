import AWS from 'aws-sdk';
import fs from 'fs';
import { Product } from 'services/types';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({region: 'eu-central-1'});

const dynamoClient = new AWS.DynamoDB.DocumentClient();

const products: Product[] = JSON.parse(fs.readFileSync('./src/productData/productData.json', 'utf8'));

products.forEach(product => {
  const params = {
    TableName: "products-table",
    Item: {
        "id":  uuidv4(),
        "title": product.title,
        "description": product.description,
        "price":  product.price,
    }
};

dynamoClient.put(params, function(err, data) {
   if (err) {
       console.error("Unable to add product", product.title, ". Error JSON:", JSON.stringify(err, null, 2));
   } else {
       console.log("PutItem succeeded:", { product: product.title, data });
   }
});
});
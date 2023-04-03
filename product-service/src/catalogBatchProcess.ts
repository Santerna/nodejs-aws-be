import { SQSEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const PRODUCT_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE_NAME;
const STOCK_TABLE = process.env.DYNAMODB_STOCK_TABLE_NAME;

export const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  const sns = new AWS.SNS({ region: 'eu-central-1' });
  const products = event.Records;
  const documentClient = new AWS.DynamoDB.DocumentClient();
  const productTableData = [];
  const stockTableData = [];

  products.forEach((product) => {
    console.log('Got product item', product);
    const productData = JSON.parse(product.body);
    console.log('Products from event', productData);
    const id = uuidv4();
    productTableData.push({
      PutRequest: {
        Item: {
          id: id,
          description: productData.description,
          title: productData.title,
          price: productData.price,
        },
      },
    });
    
    stockTableData.push({
      PutRequest: {
        Item: {
          product_id: id,
          count: productData.count,
        },
      },
    });
  });

  const putParams1 = {
    RequestItems: {
      [ PRODUCT_TABLE ]: productTableData,
    },
  };

  const putParams2 = {
    RequestItems: {
      [ STOCK_TABLE ]: stockTableData,
    },
  };

  console.log('Product table data batch', putParams1);
  documentClient.batchWrite(putParams1, function (error, data) {
    if (error) {
      throw new Error(error.message);
    } else {
      console.log('Put data succesfully', data);
    }
  });

  console.log('Stock table data batch', putParams2);
  documentClient.batchWrite(putParams2, function (error, data) {
    if (error) {
      throw new Error(error.message);
    } else {
      console.log('Put data succesfully', data);
    }
  });

  sns.publish({
    Subject: 'Created products',
    Message: JSON.stringify(products),
    TopicArn: process.env.SNS_ARN,
  }, (error, data) => {
    if (error) {
      throw new Error(error.message);
    } else {
      console.log('Publish data succesfully', data);
    }
  });
};

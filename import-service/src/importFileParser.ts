import csv from 'csv-parser';
import { S3Event } from 'aws-lambda';
import { S3, SQS } from 'aws-sdk';
import { transferFile } from "./utils/transferFile";

export const importFileParser = /*({ s3 }) => */async (event: S3Event) => {
  const s3 = new S3({ region: 'eu-central-1' });
  const bucket = 'aws-practitioner-store-uploaded';
  console.log('Got S3 event', event);

  const sqs = new SQS();

  try{
    for (const eventRecord of event.Records) {
    const params: S3.GetObjectRequest  = {
      Bucket: bucket,
      Key: eventRecord.s3.object.key,
    }
   
    await s3.getObject(params)
      .createReadStream()
      .pipe(csv({ separator: ',' }))
      .on('data', (data) => {
        sqs.sendMessage({
          QueueUrl: process.env.SQS_URL,
          MessageBody: JSON.stringify(data),
        }, () => {
          console.log('Send message with ', data);
        });
      })
      .on('end', async () => {
        console.log('CSV file parsed');
        await transferFile({ s3 }, bucket, event.Records[0].s3.object.key);
      })
    };

    return {
      status: 200,
      body: 'File parsed',
    };
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

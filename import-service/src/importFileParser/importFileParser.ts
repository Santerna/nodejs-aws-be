import { S3Event } from "aws-lambda";
import { S3 } from "aws-sdk";
import csv from 'csv-parser';

export const importFileParser = async (event: S3Event) => {
  const s3 = new S3({ region: 'eu-central-1'});
  const bucket = 'uploaded';
  let result: any[] = [];

  console.log('Got S3 event', event);

  for (const eventRecord of event.Records) {
    const params: S3.GetObjectRequest  = {
      Bucket: bucket,
      Key: eventRecord.s3.object.key,
    }
    console.log('S3 event record', eventRecord);

    await s3.getObject(params)
    .createReadStream()
    .pipe(csv({ separator: ',' }))
    .on('data', (data) => {
      console.log(data);
      result.push(data);
    })
    .on('end', () => {
      console.log('CSV file parsed');
    })
  };

  return {
    status: 200,
    body: 'File parsed',
  };
};

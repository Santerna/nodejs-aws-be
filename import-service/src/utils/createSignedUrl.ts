import { S3 } from "aws-sdk";

export const createSignedUrl = async (file: string): Promise<string> => {
  const s3 = new S3({ region: 'eu-central-1' });
  const bucket = 'uploaded';
  const params = {
    Bucket: bucket,
    Key: `uploaded/${file}`,
    ContentType: 'text/csv',
  };

  const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
  console.log('Created prisigned url', presignedUrl);

  return presignedUrl;
};

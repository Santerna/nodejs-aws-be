import { S3 } from "aws-sdk";

export const transferFile = async (bucket: string, key: string) => {
  const s3 = new S3({ region: 'eu-central-1' });
  console.log('Transeferring file', { bucket, key });

  const copyParams = {
    Bucket: bucket,
    CopySource: `${bucket}/${key}`,
    Key: `${key.replace('uploaded', 'parsed')}`
    
  };
  await s3.copyObject(copyParams).promise();

  const deleteParams = {
      Bucket: bucket,
      Key: key
  };
  await s3.deleteObject(deleteParams).promise();

  console.log(`File moved from: ${bucket}/${key}`);
}

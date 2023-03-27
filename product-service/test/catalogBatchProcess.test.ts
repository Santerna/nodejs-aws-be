import { SQSEvent } from 'aws-lambda';
import AWS, { SNS } from 'aws-sdk';
import { catalogBatchProcess } from '../src/catalogBatchProcess';

const mDocumentClientInstance = {
  batchWrite: jest.fn(),
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
  const mockedSNS = {
    publish: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };

  return { 
    DynamoDB: {
      DocumentClient: jest.fn(() => mDocumentClientInstance),
    },
    SNS: jest.fn(() => mockedSNS),
  };
});

const mockedDynamoDB = new AWS.DynamoDB.DocumentClient();

const mockEvent = {
  Records: [
    {
      messageId: '1',
      body: "{\"title\": \"test1\", \"count\": \"1\"}"
    },
    {
      messageId: '2',
      body: "{\"title\": \"test2\", \"count\": \"2\"}"
    },
    {
      messageId: '3',
      body: "{\"title\": \"test3\", \"count\": \"3\"}"
    },
    {
      messageId: '4',
      body: "{\"title\": \"test4\", \"count\": \"4\"}"
    },
    {
      messageId: '5',
      body: "{\"title\": \"test5\", \"count\": \"5\"}"
    },
  ]
} as SQSEvent;


describe('catalogBatchProcess', () => {
  let sns;

  beforeEach(() => {
    sns = new SNS();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test('should create products', async () => {
    const THIS_TOPIC_ARN = process.env.THIS_TOPIC_ARN;
    process.env.THIS_TOPIC_ARN = 'MOCK-SNS-TOPIC';
    const result = catalogBatchProcess(mockEvent);
    const mockedResponseData = {
      Success: 'OK',
    };
    sns.publish().promise.mockResolvedValueOnce(mockedResponseData);
    expect(result).resolves.toEqual({});
    expect(sns.publish).toBeCalledWith({ Message: JSON.stringify([
      {
        messageId: '1',
        body: "{title: \"test1\", count: \"1\",}"
      },
      {
        messageId: '2',
        body: "{title: \"test2\", count: \"2\",}"
      },
      {
        messageId: '3',
        body: "{title: \"test3\", count: \"3\",}"
      },
      {
        messageId: '4',
        body: "{title: \"test4\", count: \"4\",}"
      },
      {
        messageId: '5',
        body: "{title: \"test5\", count: \"5\",}"
      },
    ]), TopicArn: 'MOCK-SNS-TOPIC' });
    expect(sns.publish().promise).toBeCalledTimes(1);
    process.env.THIS_TOPIC_ARN = THIS_TOPIC_ARN;
  });

  test('should throw error if fails to write to DB', async () => {
    const mockError = new Error('network');
    mDocumentClientInstance.batchWrite.mockImplementationOnce((_, callback) => callback(mockError));
    await expect(catalogBatchProcess(mockEvent)).rejects.toThrowError('network');
  });
})

const AWS = require('aws-sdk');
const { uuid, } = require('uuidv4');

module.exports = (config) => {
  const bucketName = config.get('aws.bucketName');
  const tableName = config.get('aws.tableName');

  const db = new AWS.DynamoDB.DocumentClient({
    region: config.get('aws.region'),
    accessKeyId: config.get('aws.accessKeyId'),
    secretAccessKey: config.get('aws.secretAccessKey'),
  });

  const s3 = new AWS.S3({
    region: config.get('aws.region'),
    accessKeyId: config.get('aws.accessKeyId'),
    secretAccessKey: config.get('aws.secretAccessKey'),
  });

  // TODO: s3 instance

  // TODO
  const getAllItems = async () => {
    const params = {
      TableName: tableName,
    };
    const response = await db.scan(params).promise();
    const items = (response && response.Items) || [];
    return items.sort((a, b) => {
      return b.time - a.time;
    });
  };

  // TODO
  const generateSignedUrl = async (fileName) => {
    const url = await s3.getSignedUrlPromise('putObject', {
      Bucket: bucketName,
      Expires: 60 * 60,
      Key: `${uuid()}-${fileName}`,
    });
    return url;
  };

  // TODO
  const createNewItem = (url, text, fortuneId) => {
    const params = {
      TableName: tableName,
      Item: {
        id: uuid(),
        url,
        text,
        fortuneId,
        time: (new Date()).getTime(),
      },
    };
    return db.put(params).promise();
  };

  // const set = (setRequest) => {
  //   if (!setRequest.db) {
  //     return null;
  //   }
  //   const { tableName, } = setRequest.db;
  //   const { toSet, } = setRequest;
  //   const params = {
  //     TableName: tableName,
  //     Item: toSet,
  //   };
  //   return db.put(params).promise();
  // };

  return {
    getAllItems,
    generateSignedUrl,
    createNewItem,
  };
};

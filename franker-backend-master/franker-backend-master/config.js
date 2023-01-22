const convict = require('convict');

const config = convict({
  env: {
    format: String,
    default: 'development',
    env: 'ENVIRONMENT',
  },
  port: {
    format: 'port',
    default: 8080,
    env: 'PORT',
  },
  aws: {
    accessKeyId: {
      format: String,
      default: 'AKIAIBFSS5RLR7YQAUJA',
      env: 'AWS_ACCESS_KEY_ID',
    },
    secretAccessKey: {
      format: String,
      default: '6sJg8UsptJQgMK2/PCFLziSXb05rYgozs1oX4eVv',
      env: 'AWS_SECRET_ACCESS_KEY',
    },
    region: {
      format: String,
      default: 'us-east-2',
      env: 'AWS_REGION',
    },
    bucketName: {
      format: String,
      default: 'some-bucket-name',
      env: 'AWS_BUCKET_NAME',
    },
    tableName: {
      format: String,
      default: 'some-table-name',
      env: 'AWS_TABLE_NAME',
    },
  },
});

config.validate({ allowed: 'strict', });

module.exports = config;

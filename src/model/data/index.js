// If the environment sets an AWS Region, we'll use AWS backend
// services (S3, DynamoDB); otherwise, we'll use an in-memory db.
console.log(process.env.AWS_REGION ? require('./aws') : require('./memory'));
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');
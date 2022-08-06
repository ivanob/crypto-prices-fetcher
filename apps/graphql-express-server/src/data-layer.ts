import {DynamoDB} from 'aws-sdk';
const dynamo = new DynamoDB.DocumentClient({apiVersion: '2012-08-10', region: 'us-east-1'});

export const getItem = async (id: string) => {
    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: process.env.TABLE_NAME,
        Key: {
            'id': id
        }
    };
    const resp = await dynamo.get(params).promise();
    return resp.Item;
}

export const getItems = async () => {
    var params = {
        TableName: process.env.TABLE_NAME, 
        Select: "ALL_ATTRIBUTES"
      };
    const resp = await dynamo.scan(params).promise();
    return resp.Items;
}
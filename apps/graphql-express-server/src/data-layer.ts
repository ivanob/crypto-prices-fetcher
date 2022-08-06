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
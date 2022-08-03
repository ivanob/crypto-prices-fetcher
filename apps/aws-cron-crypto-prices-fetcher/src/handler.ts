'use strict';
import { 
  APIGatewayProxyEvent,
  Context 
} from "aws-lambda";
import {DynamoDB} from "aws-sdk";
import {v4 as uuidv4} from "uuid";
import fetch from "node-fetch"

const client = new DynamoDB.DocumentClient();

/**
 * Coingecko exposes an API to ask the current price of some cryptos and tokens. Example:
  curl -X 'GET' \
  'https://api.coingecko.com/api/v3/simple/price?ids=cardano%2Cbitcoin&vs_currencies=usd' \
  -H 'accept: application/json'
 */

const fetchCryptoCurrentData = async (cryptos: string, baseCurrency: string): Promise<any> => {
  return await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptos}&vs_currencies=${baseCurrency}`)
}

const writePriceInDB = async (crypto: string, price: number, timestamp: number) => {
  const params = {
    TableName: 'crypto-prices',
    Item: {
      id: uuidv4(),
      crypto,
      price,
      timestamp
    }
  };
  await client.put(params).promise();
}

export const run = async (event: APIGatewayProxyEvent, context: Context) => {
  const cryptoInfo = await fetchCryptoCurrentData(
    process.env.CRYPTO_NAMES,
    process.env.CURRENCY_BASE
  );
  const currentTimestamp = Math.round(Date.now() / 1000)
  const cryptoSymbols = Object.values(cryptoInfo) as string[];
  cryptoSymbols.forEach(async (cryptoSymbol, idx) => {
    await writePriceInDB(cryptoSymbol, cryptoInfo[idx], currentTimestamp);
  });
  console.log('END')
};

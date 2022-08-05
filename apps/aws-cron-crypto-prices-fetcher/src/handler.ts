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

  The response received has this shape:
   {
        bitcoin: {
            usd: 23354
        },
        cardano: {
            usd: 0.509998
        }
    }
 */
const fetchCryptoCurrentData = async (cryptos: string, baseCurrency: string): Promise<any> => {
  const resp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptos}&vs_currencies=${baseCurrency}`);
  const respObj = await resp.json();
  return respObj;
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

export const storePrices = (
  _writePriceInDB: (arg0: string, arg1: number, arg2: number
) => void) => async (
  cryptoInfo: any,
  timestamp: number
) => {
  const cryptoSymbols = Object.keys(cryptoInfo) as string[];
  console.log(`Stored price for symbols ${cryptoSymbols} at ${new Date(timestamp * 1000)}`);
  cryptoSymbols.forEach(async (cryptoSymbol) => {
    await _writePriceInDB(cryptoSymbol, cryptoInfo[cryptoSymbol].usd, timestamp);
  });
}

export const run = async (event: APIGatewayProxyEvent, context: Context) => {
  const cryptoInfo = await fetchCryptoCurrentData(
    process.env.CRYPTO_NAMES,
    process.env.CURRENCY_BASE
  );
  const currentTimestamp = Math.round(Date.now() / 1000)
  storePrices(writePriceInDB)(cryptoInfo, currentTimestamp)
};

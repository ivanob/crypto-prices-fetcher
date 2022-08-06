'use strict';

import express from "express";
import { graphqlHTTP } from "express-graphql";
import {
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLList,
    GraphQLBoolean
} from 'graphql'
import { getItem, getItems } from "./data-layer";
require('dotenv').config()

const PORT = process.env.PORT || 3000;
const server = express();

const CryptoPrice = new GraphQLObjectType({
    name: 'Crypto',
    description: 'The price of a crypto',
    fields: {
        id: {
            type: GraphQLID,
            description: 'The id of the row.',
        },
        crypto: {
            type: GraphQLString,
            description: 'The name of the crypto.',
        },
        price: {
            type: GraphQLInt,
            description: 'The price on a specific time.',
        },
        timestamp: {
            type: GraphQLInt,
            description: 'The timestamp when the price was fetched.',
        },
    },
});

const queryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'The root query type.',
    fields: { // The fields what the things are that I can query for
        cryptos: {
            type: new GraphQLList(CryptoPrice),
            args: {
                fromToday: {
                    type: GraphQLBoolean,
                    description: "return only the readings from today?"
                }
            },
            resolve: async (_,args) => {
                const currentTimestamp = Math.round(Date.now() / 1000);
                const timestampOneDayAgo = currentTimestamp - 60*60*24;
                return (args.fromToday) ?
                    (await getItems()).filter(item => item.timestamp > timestampOneDayAgo)
                    : await getItems()
            }
        },
        crypto: {
            type: CryptoPrice,
            args: {
                id: {
                    type: GraphQLID,
                    description: "The ID of the crypto"
                }
            },
            resolve: (_, args) => new Promise((resolve) => {
                resolve(getItem(args.id));
            }),
        },
    },
});

const schema = new GraphQLSchema({
    query: queryType,
});

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Enable the graphiql tool
}));

server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
    console.log('GraphiQL deployed on http://localhost:3000/graphql');
})
// (async () => {
//     const a = await getItems();
//     console.log(a);
// })();

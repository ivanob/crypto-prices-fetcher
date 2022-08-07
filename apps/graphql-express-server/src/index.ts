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
    GraphQLBoolean,
    GraphQLEnumType,
    GraphQLFloat
} from 'graphql'
import { getItem, getItems } from "./data-layer";
import { get1weekAgoTimestamp, get24hAgoTimestamp } from "./helpers";
import {groupBy, max, min} from 'underscore';
import cors from 'cors';
require('dotenv').config()

const server = express();
server.use(cors())

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
            type: GraphQLFloat,
            description: 'The price on a specific time.',
        },
        timestamp: {
            type: GraphQLInt,
            description: 'The timestamp when the price was fetched.',
        },
    },
});

const CryptoStats = new GraphQLObjectType({
    name: 'Stats',
    description: 'Stats for a specific crypto',
    fields: {
        crypto: {
            type: GraphQLString,
            description: 'The name of the crypto.',
        },
        highestPrice: {
            type: GraphQLFloat,
            description: 'The highest price for a specific period of time.',
        },
        lowestPrice: {
            type: GraphQLFloat,
            description: 'The lowest price for a specific period of time.',
        }
    }
});

enum enumPeriods {
    TODAY,
    ONE_WEEK_AGO,
    ALL_TIMES
}

const enumTimePeriod = new GraphQLEnumType({
    name: 'TimePeriodEnum',
    values: {
        TODAY: {value: enumPeriods.TODAY},
        ONE_WEEK_AGO: {value: enumPeriods.ONE_WEEK_AGO},
        ALL_TIMES: {value: enumPeriods.ALL_TIMES}
    }
});

const getPeriodFilter = (period: enumPeriods) => {
    if(period === enumPeriods.TODAY){
        return get24hAgoTimestamp;
    }else if(period === enumPeriods.ONE_WEEK_AGO){
        return get1weekAgoTimestamp;
    }
    return () => 1;
}

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
                return (args.fromToday) ?
                    (await getItems()).filter(item => item.timestamp > get24hAgoTimestamp())
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
        stats: {
            type: new GraphQLList(CryptoStats),
            args: {
                temp: {
                    type: enumTimePeriod,
                    description: "The periodicity of the search"
                }
            },
            resolve: (_, args) => new Promise(async (resolve) => {
                const allPrices = await getItems();
                // 1- Filter by periodicity
                const pricesFiltered = allPrices.filter(reading => reading.timestamp > getPeriodFilter(args.temp)());
                // 2- Group by crypto name
                const groupedCryptos = groupBy(pricesFiltered, 'crypto');
                // 3- Calculate MAX and MIN
                resolve(Object.keys(groupedCryptos).map(function(key, index) {
                    const prices = groupedCryptos[key].map(x => x.price);
                    return {
                        crypto: key,
                        highestPrice: max(prices),
                        lowestPrice: min(prices)
                }}));
            }),
        }
    },
});

const schema = new GraphQLSchema({
    query: queryType,
});

server.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Enable the graphiql tool
}));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
    console.log(`GraphiQL deployed on http://localhost:${PORT}/graphql`);
})

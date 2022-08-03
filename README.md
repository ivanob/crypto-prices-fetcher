# crypto-prices-fetcher

- [X] Create project using monorepos
- [X] Create AWS lambda function in TS
- [X] Create DynamoDB instance via code
- [X] Testing on lambdas: execute the lambda locally + unit testing


# Overview
The project aims to fetch periodically the current price of some determined cryptos and store in
a database via AWS lambda. Then, a graphql server exposes this data so can be consumed by a frontend app.
The frontend client queries custom queries over this data, so no REST APIs are used here.


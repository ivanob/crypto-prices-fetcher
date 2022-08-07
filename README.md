# crypto-prices-fetcher

These are the concepts to learn with this project:

- [X] Create project using monorepos
- [X] Create AWS lambda function in TS
- [X] Create DynamoDB instance via code
- [X] Testing on lambdas: execute the lambda locally + unit testing
- [X] Create a GraphQL server and connect it to the DynamoDB
- [X] Learn about GraphQL internals
- [X] Create a GraphQL client integrate on React

# Overview
The project aims to fetch periodically the current price of some determined cryptos and store in
a database via AWS lambda. Then, a graphql server exposes this data so can be consumed by a frontend app.
The frontend client queries custom queries over this data, so no REST APIs are used here.
All the projects use Typescript over Javascript.

# aws-cron-crypto-prices-fetcher
This is a very simple lambda function that gets executed periodically as a cron task every 60 minutes.
It receives in the environment variables a list of cryptos and a reference currency. The function
queries the prices of these cryptos using the base currency as a reference and stores them into a 
DynamoDB database.
This project is created using Serverless framerowk. It also creates the DynamoDB table via cloud
formation.
Can be deployed using: `npm run deploy`

# graphql-express-server
It is a express nodejs application that exposes a graphql server. It defines:
- The Types of the data: the type of price readings
- The resolvers that specify how to obtain the data (from the dynamoDB)
- The schema that combines everything
It exposes it via express.js in one endpoint. It exposes 2 queries:
- One to fetch the readings by period of time.
- The second to get some stats about each crypto for a specific period of time.
Can be executed locally using: `npm run start`

# client
This is a react client using graphQL library to connect to the backend in order to
fetch the data about the crypto prices readings. It presents this data in the frontend
performing some custom queries using the GrapQL query language.
Can be executed locally using: `npm run start`

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';

// This client connects to our graphql server
const client = new ApolloClient({
  cache: new InMemoryCache(), // Cache in memory, just to play
  link: new HttpLink({
    uri: 'http://localhost:3000/graphql?'
  })
});

// client.query({query}).then(res => console.log(res.data));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}e>
    <App />
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

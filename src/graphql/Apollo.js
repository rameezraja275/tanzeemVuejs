import { ApolloClient } from "apollo-client";
import { ApolloLink, from } from "apollo-link";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";

import localStorage from "../utils/localStorageService";
const localStorageService = localStorage.getService();

const httpLink = createHttpLink({
  uri: "http://192.168.1.106:4000"
});

const authLink = setContext((_, { headers }) => {
  const token = localStorageService.getAccessToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache
});

export default apolloClient;

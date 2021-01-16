import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";

import localStorage from "../utils/localStorageService";
const localStorageService = localStorage.getService();

const httpLink = createHttpLink({
  uri: "http://192.168.1.3:4000"
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

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
});

export default apolloClient;

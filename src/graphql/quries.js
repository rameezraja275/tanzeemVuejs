import gql from "graphql-tag";

export const LOGIN = gql`
  mutation userLogin($email: String!, $pass: String!) {
    userLogin(email: $email, password: $pass) {
      token
      user {
        email
        name
        id
      }
    }
  }
`;

export const GET_ACCOUNTS = gql`
  query getAccounts($acc_type: TinyInt!) {
    getAccounts(acc_type: $acc_type) {
      id
      acc_code
      acc_parent
      acc_name
      acc_type
    }
  }
`;

export const GET_ACCOUNTS_PARENTS = gql`
  query {
    getAccountParents {
      id
      acc_code
      acc_parent
      acc_name
      acc_type
    }
  }
`;

export const GET_ACCOUNTS_CHILDS = gql`
  query getAccountChilds($acc_parent: BigInt!) {
    getAccountChilds(acc_parent: $acc_parent) {
      id
      acc_code
      acc_parent
      acc_name
      acc_type
    }
  }
`;

export const ADD_ACCOUNT = gql`
  mutation addAccount(
    $acc_name: String!
    $acc_code: BigInt!
    $acc_parent: BigInt!
    $acc_type: TinyInt!
  ) {
    addAccount(
      acc_name: $acc_name
      acc_code: $acc_code
      acc_parent: $acc_parent
      acc_type: $acc_type
    ) {
      id
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation updateAccount(
    $id: Int!
    $acc_name: String!
    $acc_code: BigInt!
    $acc_parent: BigInt!
    $acc_type: TinyInt!
  ) {
    updateAccount(
      id: $id
      acc_name: $acc_name
      acc_code: $acc_code
      acc_parent: $acc_parent
      acc_type: $acc_type
    ) {
      id
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation deleteAccount($id: Int!) {
    deleteAccount(id: $id) {
      id
    }
  }
`;

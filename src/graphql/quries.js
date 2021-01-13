import gql from "graphql-tag";

export const LOGIN = gql`
  mutation Loginquery($email: String!, $pass: String!) {
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

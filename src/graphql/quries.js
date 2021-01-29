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
      acc_config
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
      acc_config
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
      acc_config
    }
  }
`;

export const ADD_ACCOUNT = gql`
  mutation addAccount(
    $acc_name: String!
    $acc_code: BigInt!
    $acc_parent: BigInt!
    $acc_type: TinyInt!
    $acc_config: TinyInt!
  ) {
    addAccount(
      acc_name: $acc_name
      acc_code: $acc_code
      acc_parent: $acc_parent
      acc_type: $acc_type
      acc_config: $acc_config
    ) {
      id
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation updateAccount(
    $id: Int!
    $acc_name: String!
    $acc_parent: BigInt!
    $acc_type: TinyInt!
    $acc_config: TinyInt!
  ) {
    updateAccount(
      id: $id
      acc_name: $acc_name
      acc_parent: $acc_parent
      acc_type: $acc_type
      acc_config: $acc_config
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

export const GET_ACCOUNTS_CONFIG = gql`
  query {
    getAccountConfig {
      id
      label
    }
  }
`;

export const ADD_POST_VOUCHER = gql`
  mutation addAccountVoucher(
    $voucher_date: Date!
    $voucher_type: Int!
    $data: [Add_Voucher_Input]
  ) {
    addAccountVoucher(
      voucher_date: $voucher_date
      voucher_type: $voucher_type
      data: $data
    ) {
      message
      status
    }
  }
`;

export const UPDATE_POST_VOUCHER = gql`
  mutation updateAccountVoucher(
    $voucher_date: Date!
    $voucher_type: Int!
    $acc_master_id: Int!
    $data: [Update_Voucher_Input]
  ) {
    updateAccountVoucher(
      voucher_date: $voucher_date
      voucher_type: $voucher_type
      acc_master_id: $acc_master_id
      data: $data
    ) {
      message
      status
    }
  }
`;

export const GET_VOUCHER_POST = gql`
  query getGroupVouchers($voucher_date: Date) {
    getGroupVouchers(voucher_date: $voucher_date) {
      id
    }
  }
`;

export const GET_VOUCHERS_BY_GROUPID = gql`
  query getAccountVouchers($id: Int!) {
    getAccountVouchers(id: $id) {
      group_details {
        voucher_date
        voucher_type
      }
      vouchers {
        id
        acc_master_id
        acc_code_id
        acc_no_id
        narration
        dr
        cr
      }
    }
  }
`;

export const DELETE_POST_VOUCHER = gql`
  mutation deleteVoucherGroup($id: Int!) {
    deleteVoucherGroup(id: $id) {
      message
      status
    }
  }
`;

export const GET_ACCOUNT_HOLDERS = gql`
  query {
    getAccountHolders {
      id
      first_name
      last_name
      cnic
      gender
      acc_code
      cell
    }
  }
`;

// export const ADD_ACCOUNT_HOLDER = gql`
//   mutation addAccountHolder() {

//   }
// `

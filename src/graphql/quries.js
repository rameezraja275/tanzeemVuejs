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

export const GET_ACCOUNTS_NO_ID = gql`
  query {
    getAccounts {
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
      acc_code_id
      acc_no
      first_name
      middle_name
      last_name
      guardian_type
      guardian_name
      cell
      landline_no
      cnic
      gender
      dob
      address
      opening_date
    }
  }
`;

export const ADD_ACCOUNT_HOLDER = gql`
  mutation addAccountHolder(
    $acc_code_id: BigInt
    $acc_no: BigInt
    $first_name: String
    $middle_name: String
    $last_name: String
    $guardian_type: String
    $guardian_name: String
    $cell: String
    $landline_no: String
    $cnic: String
    $gender: String
    $dob: Date
    $address: String
    $opening_date: Date
    $guarantor: [Account_Guarantor_Input]
  ) {
    addAccountHolder(
      acc_code_id: $acc_code_id
      acc_no: $acc_no
      first_name: $first_name
      middle_name: $middle_name
      last_name: $last_name
      guardian_type: $guardian_type
      guardian_name: $guardian_name
      cell: $cell
      landline_no: $landline_no
      cnic: $cnic
      gender: $gender
      dob: $dob
      address: $address
      opening_date: $opening_date
      guarantor: $guarantor
    ) {
      message
      status
    }
  }
`;

export const DELETE_ACCOUNT_HOLDER = gql`
  mutation deleteAccountHolder($id: Int!) {
    deleteAccountHolder(id: $id) {
      message
      status
    }
  }
`;

export const UPDATE_ACCOUNT_HOLDER = gql`
  mutation updateAccountHolder(
    $id: Int
    $first_name: String
    $middle_name: String
    $last_name: String
    $guardian_type: String
    $guardian_name: String
    $cell: String
    $landline_no: String
    $cnic: String
    $gender: String
    $dob: Date
    $address: String
    $guarantor: [Account_Guarantor_Input]
  ) {
    updateAccountHolder(
      id: $id
      first_name: $first_name
      middle_name: $middle_name
      last_name: $last_name
      guardian_type: $guardian_type
      guardian_name: $guardian_name
      cell: $cell
      landline_no: $landline_no
      cnic: $cnic
      gender: $gender
      dob: $dob
      address: $address
      guarantor: $guarantor
    ) {
      message
      status
    }
  }
`;

export const GET_ACCOUNT_HOLDERS_BY_ID = gql`
  query getAccountHolderById($id: Int!) {
    getAccountHolderById(id: $id) {
      account_holder {
        id
        acc_code_id
        acc_no
        first_name
        middle_name
        last_name
        guardian_type
        guardian_name
        cell
        landline_no
        cnic
        gender
        dob
        address
        opening_date
      }
      guarantors {
        acc_no_id
        guarantor_name
        cnic
        contact
      }
    }
  }
`;

export const GET_LOAN_ISSUES = gql`
  query {
    getLoanIssues {
      id
      issue_date
      loan_type
      transfer_acc_code_id
      transfer_acc_no_id
      loan_acc_no_id
      loan_amount
      markup_percentage
      issue_duration
      maturity_date
      narration
      createdAt
      updatedAt
    }
  }
`;

export const GET_LOAN_ISSUES_BY_ID = gql`
  query getLoanIssueById($id: Int!) {
    getLoanIssueById(id: $id) {
      loan_issue {
        id
        issue_date
        loan_type
        transfer_acc_code_id
        transfer_acc_no_id
        loan_acc_no_id
        loan_amount
        markup_percentage
        issue_duration
        maturity_date
        narration
        createdAt
        updatedAt
      }
      guarantors {
        acc_no_id
        guarantor_name
        cnic
        contact
      }
    }
  }
`;

export const ADD_LOAN_ISSUE = gql`
  mutation addLoanIssue(
    $issue_date: Date
    $loan_type: TinyInt
    $transfer_acc_code_id: BigInt
    $transfer_acc_no_id: BigInt
    $loan_acc_no_id: BigInt
    $loan_amount: Decimal
    $markup_percentage: Float
    $issue_duration: Int
    $maturity_date: Date
    $narration: String
    $guarantor: [Account_Guarantor_Input]
  ) {
    addLoanIssue(
      issue_date: $issue_date
      loan_type: $loan_type
      transfer_acc_code_id: $transfer_acc_code_id
      transfer_acc_no_id: $transfer_acc_no_id
      loan_acc_no_id: $loan_acc_no_id
      loan_amount: $loan_amount
      markup_percentage: $markup_percentage
      issue_duration: $issue_duration
      maturity_date: $maturity_date
      narration: $narration
      guarantor: $guarantor
    ) {
      message
      status
    }
  }
`;

export const UPDATE_LOAN_ISSUE = gql`
  mutation updateLoanIssue(
    $id: Int
    $issue_date: Date
    $loan_type: TinyInt
    $transfer_acc_code_id: BigInt
    $transfer_acc_no_id: BigInt
    $loan_acc_no_id: BigInt
    $loan_amount: Decimal
    $markup_percentage: Float
    $issue_duration: Int
    $maturity_date: Date
    $narration: String
    $guarantor: [Account_Guarantor_Input]
  ) {
    updateLoanIssue(
      id: $id
      issue_date: $issue_date
      loan_type: $loan_type
      transfer_acc_code_id: $transfer_acc_code_id
      transfer_acc_no_id: $transfer_acc_no_id
      loan_acc_no_id: $loan_acc_no_id
      loan_amount: $loan_amount
      markup_percentage: $markup_percentage
      issue_duration: $issue_duration
      maturity_date: $maturity_date
      narration: $narration
      guarantor: $guarantor
    ) {
      message
      status
    }
  }
`;

export const DELETE_LOAN_ISSUE = gql`
  mutation deleteLoanIssue($id: Int) {
    deleteLoanIssue(id: $id) {
      message
      status
    }
  }
`;

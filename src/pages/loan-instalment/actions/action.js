import {
  GET_ACCOUNTS,
  GET_ACCOUNTS_CHILDS,
  ADD_LOAN_INSTALMENT,
  GET_MARKUP_DETAIL,
  GET_LOAN_INSTALMENTS,
  DELETE_LOAN_INSTALMENT
} from "../../../graphql/quries";
// import { omitTypeOff } from "../../../utils/helpers";
import { GROUP_ACCOUNTS } from "../../../utils/constants";

export async function fetchAccounts(vueObj) {
  const variables = {
    acc_type: GROUP_ACCOUNTS
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNTS,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      result.data.getAccounts.forEach(element => {
        if (element.acc_name == "Loan") {
          fetchAccountChilds(vueObj, element.id, "forLoans");
        }
      });
      vueObj.allGroupAccounts = result.data.getAccounts;
    }
  } catch (e) {
    vueObj.message = e;
  }
}

export async function fetchAccountChilds(vueObj, ID, from) {
  const variables = {
    acc_parent: ID
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNTS_CHILDS,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      if (from == "forLoans") {
        vueObj.loanAccounts = result.data.getAccountChilds;
      } else {
        vueObj.accountChilds = result.data.getAccountChilds;
      }
    }
  } catch (e) {
    vueObj.message = e;
  }
}

export async function addNewLoanInstalment(vueObj) {
  vueObj.submitLoading = true;
  let variables = {
    deposit_date: vueObj.dataFromInputs.deposit_date,
    deposit_type: Number(vueObj.dataFromInputs.deposit_type),
    transfer_acc_code_id: Number(vueObj.dataFromInputs.transfer_acc_code_id),
    transfer_acc_no_id: Number(vueObj.dataFromInputs.transfer_acc_no_id),
    loan_acc_no_id: Number(vueObj.dataFromInputs.loan_acc_no_id),
    deposit_amount: Number(vueObj.dataFromInputs.deposit_amount),
    narration: vueObj.dataFromInputs.narration
  };
  if (variables.deposit_type == 1) {
    variables.transfer_acc_code_id = 0;
    variables.transfer_acc_no_id = 0;
  }

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: ADD_LOAN_INSTALMENT,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackBarColor = "success";
      vueObj.snackbarText = result.data.addLoanInstallment.message;
      vueObj.snackbarModel = true;
      vueObj.close();
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    var error = e.toString();
    error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackbarText = error;
    vueObj.snackbarModel = true;
  }

  vueObj.submitLoading = false;
}

export async function fetchMarkUpDetails(vueObj) {
  const variables = {
    ...vueObj.markupDetails
  };

  try {
    const result = await vueObj.$apollo.query({
      query: GET_MARKUP_DETAIL,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.receivedMarkupData = result.data.getMarkupDetail;
    }
  } catch (e) {
    vueObj.message = e;
  }
}

export async function fetchLoanInstalments(vueObj) {
  vueObj.tableLoading = true;
  try {
    const result = await vueObj.$apollo.query({
      query: GET_LOAN_INSTALMENTS
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.loanInstalments = result.data.getLoanInstallment;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.tableLoading = false;
}

export async function deleteLoanInstalment(vueObj, ID) {
  const variables = {
    id: ID
  };

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: DELETE_LOAN_INSTALMENT,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackBarColor = "success";
      vueObj.snackbarText = result.data.addLoanInstallment.message;
      vueObj.snackbarModel = true;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    var error = e.toString();
    error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackbarText = error;
    vueObj.snackbarModel = true;
  }
}

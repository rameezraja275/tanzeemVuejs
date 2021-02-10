import {
  GET_LOAN_ISSUES,
  GET_LOAN_ISSUES_BY_ID,
  ADD_LOAN_ISSUE,
  UPDATE_LOAN_ISSUE,
  DELETE_LOAN_ISSUE,
  GET_ACCOUNTS,
  GET_ACCOUNTS_CHILDS
} from "../../../graphql/quries";
import { omitTypeOff } from "../../../utils/helpers";
import { GROUP_ACCOUNTS } from "../../../utils/constants";

export async function fetchLoanIssues(vueObj) {
  vueObj.loaderOn = true;
  try {
    const result = await vueObj.$apollo.query({
      query: GET_LOAN_ISSUES
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.loanAccountDetails = result.data.getLoanIssues;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.loaderOn = false;
}

export async function fetchLoanIssuesById(vueObj, ID) {
  vueObj.loaderOn = true;
  const variables = {
    id: Number(ID)
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_LOAN_ISSUES_BY_ID,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.dataFromInputs = result.data.getLoanIssueById.loan_issue;
      if (result.data.getLoanIssueById.guarantors.length !== 0) {
        vueObj.guarantor1 = result.data.getLoanIssueById.guarantors[0];
        vueObj.guarantor2 = result.data.getLoanIssueById.guarantors[1];
      }
      vueObj.dialog = true;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.loaderOn = false;
}

export async function addNewLoanIssue(vueObj) {
  vueObj.submitLoading = true;
  console.log(vueObj.loanAccountDetails, "loan account details");
  let variables = {
    issue_date: vueObj.dataFromInputs.issue_date,
    loan_type: Number(vueObj.dataFromInputs.loan_type),
    loan_acc_no_id: Number(vueObj.dataFromInputs.loan_acc_no_id),
    transfer_acc_code_id: Number(vueObj.dataFromInputs.transfer_acc_code_id),
    transfer_acc_no_id: Number(vueObj.dataFromInputs.transfer_acc_no_id),
    loan_amount: Number(vueObj.dataFromInputs.loan_amount),
    markup_percentage: Number(vueObj.dataFromInputs.markup_percentage),
    issue_duration: Number(vueObj.dataFromInputs.issue_duration),
    maturity_date: vueObj.dataFromInputs.maturity_date,
    narration: vueObj.dataFromInputs.narration,
    guarantor: vueObj.dataFromInputs.guarantor
  };
  if (variables.loan_type == 1) {
    variables.transfer_acc_code_id = 0;
    variables.transfer_acc_no_id = 0;
  }

  console.log(variables, "new loan data before sending");

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: ADD_LOAN_ISSUE,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      console.log("successfully added new loan");
      vueObj.loanAccountDetails.push(result.data.addLoanIssue);
      vueObj.snackbarSuccessLoan = true;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackbarFailedLoan = true;
  }
  vueObj.submitLoading = false;
}

export async function updateLoanIssue(vueObj, itemId) {
  vueObj.submitLoading = true;
  var dataToSend = omitTypeOff(vueObj.dataFromInputs);
  const variables = {
    id: itemId,
    issue_date: dataToSend.issue_date,
    loan_type: Number(dataToSend.loan_type),
    transfer_acc_code_id: Number(dataToSend.transfer_acc_code_id),
    transfer_acc_no_id: Number(dataToSend.transfer_acc_no_id),
    loan_acc_no_id: Number(dataToSend.loan_acc_no_id),
    loan_amount: Number(dataToSend.loan_amount),
    markup_percentage: Number(dataToSend.markup_percentage),
    issue_duration: Number(dataToSend.issue_duration),
    maturity_date: dataToSend.maturity_date,
    narration: dataToSend.narration,
    guarantor: dataToSend.guarantor
  };

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: UPDATE_LOAN_ISSUE,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      console.log("successfully edited");
      vueObj.snackbarSuccessEdit = true;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackbarFailedEdit = true;
  }
  vueObj.submitLoading = false;
}

export async function deleteLoanIssue(vueObj, ID) {
  vueObj.loaderOn = true;
  const variables = {
    id: ID
  };

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: DELETE_LOAN_ISSUE,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackbarSuccessDelete = true;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackbarFailedDelete = true;
  }
  vueObj.loaderOn = false;
}

export async function getDetailAccounts(vueObj) {
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
      const variables = {
        acc_parent: null
      };
      result.data.getAccounts.forEach(element => {
        if (element.acc_name == "Loan") {
          variables.acc_parent = element.id;
        }
      });
      try {
        const result2 = await vueObj.$apollo.query({
          query: GET_ACCOUNTS_CHILDS,
          variables: variables
        });
        if (result2.errors) {
          throw result2.errors[0].message;
        } else {
          vueObj.loanAccounts = result2.data.getAccountChilds;
        }
      } catch (e) {
        vueObj.message = e;
      }
    }
  } catch (e) {
    vueObj.message = e;
  }
}

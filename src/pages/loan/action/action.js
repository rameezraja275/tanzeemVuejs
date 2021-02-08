import {
  GET_LOAN_ISSUES,
  GET_LOAN_ISSUES_BY_ID,
  ADD_LOAN_ISSUE,
  UPDATE_LOAN_ISSUE,
  DELETE_LOAN_ISSUE
} from "../../../graphql/quries";

export async function fetchLoanIssues(vueObj) {
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
}

export async function fetchLoanIssuesById(vueObj, ID) {
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
}

export async function addNewLoanIssue(vueObj) {
  const variables = {
    issue_date: vueObj.dataFromInputs.issue_date,
    loan_type: Number(vueObj.dataFromInputs.loan_type),
    transfer_acc_code_id: Number(vueObj.dataFromInputs.transfer_acc_code_id),
    transfer_acc_no_id: Number(vueObj.dataFromInputs.transfer_acc_no_id),
    loan_acc_code_id: Number(vueObj.dataFromInputs.loan_acc_code_id),
    loan_acc_no_id: Number(vueObj.dataFromInputs.loan_acc_no_id),
    loan_amount: Number(vueObj.dataFromInputs.loan_amount),
    markup_percentage: Number(vueObj.dataFromInputs.markup_percentage),
    issue_duration: Number(vueObj.dataFromInputs.issue_duration),
    maturity_date: vueObj.dataFromInputs.maturity_date,
    narration: vueObj.dataFromInputs.narration,
    guarantor: vueObj.dataFromInputs.guarantor
  };
  console.log(variables);

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: ADD_LOAN_ISSUE,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      console.log("successfully added new loan");
    }
  } catch (e) {
    vueObj.message = e;
  }
}

export async function updateLoanIssue(vueObj, itemId) {
  const variables = {
    id: itemId,
    issue_date: vueObj.dataFromInputs.issue_date,
    loan_type: Number(vueObj.dataFromInputs.loan_type),
    transfer_acc_code_id: Number(vueObj.dataFromInputs.transfer_acc_code_id),
    transfer_acc_no_id: Number(vueObj.dataFromInputs.transfer_acc_no_id),
    loan_acc_code_id: Number(vueObj.dataFromInputs.loan_acc_code_id),
    loan_acc_no_id: Number(vueObj.dataFromInputs.loan_acc_no_id),
    loan_amount: Number(vueObj.dataFromInputs.loan_amount),
    markup_percentage: Number(vueObj.dataFromInputs.markup_percentage),
    issue_duration: Number(vueObj.dataFromInputs.issue_duration),
    maturity_date: vueObj.dataFromInputs.maturity_date,
    narration: vueObj.dataFromInputs.narration,
    guarantor: vueObj.dataFromInputs.guarantor
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
    }
  } catch (e) {
    vueObj.message = e;
  }
}

export async function deleteLoanIssue(vueObj, ID) {
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
    }
  } catch (e) {
    vueObj.message = e;
  }
}

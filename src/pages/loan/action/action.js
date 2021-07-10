import {
  GET_LOAN_ISSUES,
  GET_LOAN_ISSUES_BY_ID,
  ADD_LOAN_ISSUE,
  UPDATE_LOAN_ISSUE,
  DELETE_LOAN_ISSUE,
  GET_ACCOUNTS,
  GET_ACCOUNTS_CHILDS,
  GET_CONFIGURE_ACCOUNT_ID
} from "../../../graphql/quries";
import {
  omitTypeOff,
  removeGraphQlTagFromErrors
} from "../../../utils/helpers";
import { GROUP_ACCOUNTS, ACCOUNT_CONFIG_LOAN } from "../../../utils/constants";

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
      vueObj.guarantor1 = result.data.getLoanIssueById.guarantors[0];
      vueObj.guarantor2 = result.data.getLoanIssueById.guarantors[1];
      vueObj.dialog = true;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.loaderOn = false;
}

export async function addNewLoanIssue(vueObj) {
  vueObj.submitLoading = true;
  var snackBarTxt = null;
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

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: ADD_LOAN_ISSUE,
      variables: variables,
      update: (cache, { data: { addLoanIssue } }) => {
        let currentLoanIssues = cache.readQuery({
          query: GET_LOAN_ISSUES
        });
        addLoanIssue.loan_acc_name = vueObj.accountName;
        cache.writeQuery({
          query: GET_LOAN_ISSUES,
          data: {
            getLoanIssues: [...currentLoanIssues.getLoanIssues, addLoanIssue]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.loanAccountDetails.push(result.data.addLoanIssue);
      snackBarTxt = "Successfully added new loan issue";
      vueObj.snackBarColor = "success";
      vueObj.close();
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    // var error = e.toString();
    // error = error.replace("Error: GraphQL error: ", "");
    snackBarTxt = removeGraphQlTagFromErrors(e);
  }
  vueObj.submitLoading = false;
  vueObj.snackBarText = snackBarTxt;
  vueObj.snackBarModel = true;
}

export async function updateLoanIssue(vueObj, editedIndex) {
  vueObj.submitLoading = true;
  var snackBarTxt = null;
  var dataToSend = omitTypeOff(vueObj.dataFromInputs);
  const variables = {
    id: vueObj.selectedItemId,
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
      variables: variables,
      update: (cache, { data: { updateLoanIssue } }) => {
        let currentData = cache.readQuery({
          query: GET_LOAN_ISSUES
        });
        let temp = [...currentData.getLoanIssues];
        currentData.getLoanIssues.forEach((element, index) => {
          if (element.id == variables.id) {
            temp[index] = updateLoanIssue;
            temp[index].loan_acc_name = vueObj.accountName;
          }
        });
        cache.writeQuery({
          query: GET_LOAN_ISSUES,
          data: {
            getLoanIssues: [...temp]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.dataFromInputs.loan_acc_name = vueObj.accountName;
      Object.assign(
        vueObj.loanAccountDetails[editedIndex],
        result.data.updateLoanIssue
      );
      vueObj.snackBarColor = "success";
      snackBarTxt = "Successfully updated loan issue";
      vueObj.close();
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    // var error = e.toString();
    // error = error.replace("Error: GraphQL error: ", "");
    snackBarTxt = removeGraphQlTagFromErrors(e);
  }
  vueObj.submitLoading = false;
  vueObj.snackBarText = snackBarTxt;
  vueObj.snackBarModel = true;
}

export async function deleteLoanIssue(vueObj, editedIndex) {
  vueObj.deleteBtnLoading = true;
  const variables = {
    id: vueObj.selectedItemId
  };

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: DELETE_LOAN_ISSUE,
      variables: variables,
      update: (cache, { data: { result } }) => {
        let currentData = cache.readQuery({
          query: GET_LOAN_ISSUES
        });

        let temp = [...currentData.getLoanIssues];
        currentData.getLoanIssues.forEach((element, index) => {
          if (element.id == variables.id) {
            temp.splice(index, 1);
          }
        });

        cache.writeQuery({
          query: GET_LOAN_ISSUES,
          data: {
            getLoanIssues: [...temp]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.loanAccountDetails.splice(editedIndex, 1);
      vueObj.snackBarText = "Successfully deleted loan issue";
      vueObj.snackBarColor = "success";
      vueObj.snackBarModel = true;
      vueObj.closeDelete();
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    // var error = e.toString();
    // error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackBarText = removeGraphQlTagFromErrors(e);
    vueObj.snackBarModel = true;
  }
  vueObj.deleteBtnLoading = false;
}

export async function getDetailAccounts(vueObj) {
  const variables = {
    acc_type: GROUP_ACCOUNTS
  };
  vueObj.slctTrnsfrAcCodeLoader = true;

  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNTS,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.allGroupAccounts = result.data.getAccounts;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.slctTrnsfrAcCodeLoader = false;
}

export async function getAccNoItems(vueObj) {
  vueObj.slctLoanAcNoLoader = true;
  const variables = {
    acc_config: ACCOUNT_CONFIG_LOAN
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_CONFIGURE_ACCOUNT_ID,
      variables: variables,
      fetchPolicy: "network-only"
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      const variables2 = {
        acc_parent: result.data.getConfigureAccount[0].id
      };
      try {
        const result2 = await vueObj.$apollo.query({
          query: GET_ACCOUNTS_CHILDS,
          variables: variables2,
          fetchPolicy: "network-only"
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

  vueObj.slctLoanAcNoLoader = false;
}

export async function getAccountChilds(vueObj, accParent) {
  const variables = {
    acc_parent: accParent
  };
  vueObj.slctTrnsfrAccNoIdLoader = true;

  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNTS_CHILDS,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.childsAfterSelection = result.data.getAccountChilds;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.slctTrnsfrAccNoIdLoader = false;
}

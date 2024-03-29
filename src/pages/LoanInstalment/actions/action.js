import {
  GET_ACCOUNTS,
  GET_ACCOUNTS_CHILDS,
  ADD_LOAN_INSTALMENT,
  GET_MARKUP_DETAIL,
  GET_LOAN_INSTALMENTS,
  DELETE_LOAN_INSTALMENT,
  GET_LOAN_INSTALMENTS_BY_ID,
  UPDATE_LOAN_INSTALMENT,
  GET_CONFIGURE_ACCOUNT_ID
} from "../../../graphql/quries";
import { removeGraphQlTagFromErrors } from "../../../utils/helpers";
import { GROUP_ACCOUNTS, ACCOUNT_CONFIG_LOAN } from "../../../utils/constants";

export async function fetchAccounts(vueObj) {
  const variables = {
    acc_type: GROUP_ACCOUNTS
  };
  vueObj.slctTrnsfrAcCodeLoader = true;
  vueObj.slctloanAcNoIdLoader = true;
  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNTS,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      // result.data.getAccounts.forEach(element => {
      //   if (element.acc_name == "Loan") {
      //     fetchAccountChilds(vueObj, element.id, "forLoans");
      //   }
      // });
      vueObj.allGroupAccounts = result.data.getAccounts;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.slctTrnsfrAcCodeLoader = false;
  vueObj.slctloanAcNoIdLoader = false;
}

export async function getLoanAccNoItems(vueObj) {
  vueObj.slctLoanAcNoLoader = true;
  const variables = {
    acc_config: ACCOUNT_CONFIG_LOAN
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_CONFIGURE_ACCOUNT_ID,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      fetchAccountChilds(
        vueObj,
        result.data.getConfigureAccount[0].id,
        "forLoans"
      );
    }
  } catch (e) {
    vueObj.message = e;
  }

  vueObj.slctLoanAcNoLoader = false;
}

export async function fetchAccountChilds(vueObj, ID, from) {
  const variables = {
    acc_parent: ID
  };
  if (from !== "forLoans") {
    vueObj.slctTrnsfrAcNoIdLoader = true;
  }
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
  vueObj.slctTrnsfrAcNoIdLoader = false;
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
      variables: variables,
      update: (cache, { data: { addLoanInstallment } }) => {
        let currentData = cache.readQuery({
          query: GET_LOAN_INSTALMENTS,
          variables: {
            limit: vueObj.limit,
            offset: vueObj.offset,
            loan_acc_no_id: 0
          }
        });
        addLoanInstallment.loan_acc_name = vueObj.accountName;
        cache.writeQuery({
          query: GET_LOAN_INSTALMENTS,
          data: {
            getLoanInstallment: [
              ...currentData.getLoanInstallment,
              addLoanInstallment
            ]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackBarColor = "success";
      vueObj.snackbarText = "Successfully added new loan instalment";
      vueObj.snackbarModel = true;
      result.data.addLoanInstallment.loan_acc_name = vueObj.accountName;
      vueObj.loanInstalments.push(result.data.addLoanInstallment);
      vueObj.close();
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(e);
    vueObj.snackbarModel = true;
  }

  vueObj.submitLoading = false;
}

export async function fetchMarkUpDetails(vueObj) {
  const variables = {
    ...vueObj.markupDetails
  };
  vueObj.markUpDetailsLoading = true;

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
    vueObj.receivedMarkupData = {};
  }
  vueObj.markUpDetailsLoading = false;
}

export async function fetchLoanInstalments(vueObj, data) {
  vueObj.tableLoading = true;
  const variables = {
    limit: data.limit,
    offset: data.offset,
    loan_acc_no_id: 0
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_LOAN_INSTALMENTS,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.loanInstalments = result.data.getLoanInstallment;
      vueObj.totalItems = vueObj.loanInstalments[0].TotalRecords;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.offset = vueObj.offset - 11;
  }
  vueObj.tableLoading = false;
}

export async function deleteLoanInstalment(vueObj, ID) {
  vueObj.deleteBtnLoading = true;
  const variables = {
    id: ID
  };

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: DELETE_LOAN_INSTALMENT,
      variables: variables,
      update: cache => {
        let currentData = cache.readQuery({
          query: GET_LOAN_INSTALMENTS,
          variables: {
            limit: vueObj.limit,
            offset: vueObj.offset,
            loan_acc_no_id: 0
          }
        });
        let temp = [...currentData.getLoanInstallment];
        currentData.getLoanInstallment.forEach((element, index) => {
          if (element.id === variables.id) {
            temp.splice(index, 1);
          }
        });
        cache.writeQuery({
          query: GET_LOAN_INSTALMENTS,
          data: {
            getLoanInstallment: [...temp]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackBarColor = "success";
      vueObj.snackbarText = result.data.deleteLoanInstallment.message;
      vueObj.loanInstalments.splice(vueObj.editedIndex, 1);
      vueObj.snackbarModel = true;
      vueObj.closeDelete();
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(e);
    vueObj.snackbarModel = true;
  }
  vueObj.deleteBtnLoading = false;
}

export async function getLoanInstalmentById(vueObj, item) {
  vueObj.tableLoading = true;
  const variables = {
    id: item.id
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_LOAN_INSTALMENTS_BY_ID,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.dataFromInputs = result.data.getLoanInstallmentById;
      vueObj.dialog = true;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.viewLoanInstalment = false;
  }
  vueObj.tableLoading = false;
}

export async function updateLoanInstalment(vueObj) {
  vueObj.submitLoading = true;
  const variables = {
    id: vueObj.editId,
    ...vueObj.dataFromInputs
  };

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: UPDATE_LOAN_INSTALMENT,
      variables: variables,
      update: (cache, { data: { updateLoanInstallment } }) => {
        let currentData = cache.readQuery({
          query: GET_LOAN_INSTALMENTS
        });
        let temp = [...currentData.getLoanInstallment];
        updateLoanInstallment.loan_acc_name = vueObj.accountName;
        currentData.getLoanInstallment.forEach((element, index) => {
          if (element.id === variables.id) {
            temp.splice(index, 1, updateLoanInstallment);
          }
        });

        cache.writeQuery({
          query: GET_LOAN_INSTALMENTS,
          data: {
            getLoanInstallment: [...temp]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackBarColor = "success";
      vueObj.snackbarText = "Successfully updated loan instalment";
      vueObj.snackbarModel = true;
      Object.assign(
        vueObj.loanInstalments[vueObj.editedIndex],
        vueObj.dataFromInputs
      );
      vueObj.close();
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(e);
    vueObj.snackbarModel = true;
  }
  vueObj.submitLoading = false;
}

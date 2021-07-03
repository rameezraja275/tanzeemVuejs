import {
  ACCOUNT_LEDGER_REPORT,
  GET_ACCOUNTS_CHILDS,
  GET_TRIAL_BALANCE,
  GET_LOAN_LEDGER,
  GET_CONFIGURE_ACCOUNT_ID,
  GET_LOAN_ISSUES_AMOUNT_ONLY
} from "../../../graphql/quries";
import { removeGraphQlTagFromErrors } from "../../../utils/helpers";
import { ACCOUNT_CONFIG_LOAN } from "../../../utils/constants";

export async function fetchReportsAcLedger(vueObj) {
  vueObj.btnLoading = true;
  vueObj.tableLoadingStatus(true);
  let variables = {
    acc_no_id: vueObj.dataFromInputs.accNoId,
    acc_code_id: vueObj.dataFromInputs.acCodeId,
    start_date: vueObj.dataFromInputs.startDate,
    end_date: vueObj.dataFromInputs.endDate
  };
  if (!variables.acc_no_id) {
    variables.acc_no_id = 0;
  }
  try {
    const result = await vueObj.$apollo.query({
      query: ACCOUNT_LEDGER_REPORT,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.emitFetchedReports(result.data.getAccountLedgerReport);
    }
  } catch (error) {
    vueObj.message = error;
    vueObj.snackbarModel = true;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(error);
  }
  vueObj.btnLoading = false;
  vueObj.tableLoadingStatus(false);
}

export async function fetchReportsTrialBlnc(vueObj) {
  vueObj.btnLoading = true;
  vueObj.tableLoadingStatus(true);
  let variables = {
    date: vueObj.dataFromInputs.startDate
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_TRIAL_BALANCE,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.emitFetchedReports(result.data.getTrialBalance);
    }
  } catch (error) {
    vueObj.message = error;
    vueObj.snackbarModel = true;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(error);
  }
  vueObj.btnLoading = false;
  vueObj.tableLoadingStatus(false);
}

export async function fetchAccountChilds(vueObj) {
  vueObj.selectLoadingACNo = true;
  const vars = {
    acc_parent: vueObj.dataFromInputs.acCodeId
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNTS_CHILDS,
      variables: vars
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.acNoArr = result.data.getAccountChilds;
    }
  } catch (error) {
    vueObj.message = error;
    vueObj.snackbarModel = true;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(error);
  }
  vueObj.selectLoadingACNo = false;
}

export async function fetchReportsBlncSheet(vueObj) {
  vueObj.btnLoading = true;
  vueObj.tableLoadingStatus(true);
  let variables = {
    start_data: vueObj.dataFromInputs.startDate
  };
  try {
    const result = await vueObj.$apollo.query({
      query: ACCOUNT_LEDGER_REPORT,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.emitFetchedReports(result.data.REPORTS);
    }
  } catch (error) {
    vueObj.message = error;
    vueObj.snackbarModel = true;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(error);
  }
  vueObj.btnLoading = false;
  vueObj.tableLoadingStatus(false);
}

export async function fetchReportsLoanLedger(vueObj) {
  vueObj.btnLoading = true;
  vueObj.tableLoadingStatus(true);
  let variables = {
    issue_id: vueObj.dataFromInputs.selected_loan
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_LOAN_LEDGER,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.emitFetchedReports(result.data.getLoanLedger.ledger);
    }
  } catch (error) {
    vueObj.message = error;
    vueObj.snackbarModel = true;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(error);
  }
  vueObj.btnLoading = false;
  vueObj.tableLoadingStatus(false);
}

export async function getLoanAccounts(vueObj) {
  vueObj.getLoanAccountsLoading = true;
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
      const variables2 = {
        acc_parent: result.data.getConfigureAccount[0].id
      };
      try {
        const result2 = await vueObj.$apollo.query({
          query: GET_ACCOUNTS_CHILDS,
          variables: variables2
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
  } catch (error) {
    vueObj.message = error;
    vueObj.snackbarModel = true;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(error);
  }

  vueObj.getLoanAccountsLoading = false;
}

export async function fetchLoanHistory(vueObj) {
  vueObj.loanHistoryLoading = true;
  let variables = {
    loan_acc_no_id: vueObj.dataFromInputs.loan_Ac_No
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_LOAN_ISSUES_AMOUNT_ONLY,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.loanHistory = result.data.getLoanIssues;
    }
  } catch (error) {
    vueObj.message = error;
    vueObj.snackbarModel = true;
    vueObj.snackBarColor = "red";
    vueObj.snackbarText = removeGraphQlTagFromErrors(error);
  }
  vueObj.loanHistoryLoading = false;
}

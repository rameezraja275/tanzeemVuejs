import {
  ACCOUNT_LEDGER_REPORT,
  GET_ACCOUNTS_CHILDS
} from "../../../graphql/quries";
import { removeGraphQlTagFromErrors } from "../../../utils/helpers";

export async function fetchReports(vueObj) {
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
  console.log(variables, "vars");
  try {
    const result = await vueObj.$apollo.query({
      query: ACCOUNT_LEDGER_REPORT,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      console.log(result, "reports");
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

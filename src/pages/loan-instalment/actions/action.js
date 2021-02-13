import {
  GET_ACCOUNTS,
  GET_ACCOUNTS_CHILDS,
  ADD_LOAN_INSTALMENT,
  GET_MARKUP_DETAIL
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
  const variables = {
    ...vueObj.dataFromInputs
  };

  try {
    const result = await vueObj.$apollo.mutate({
      mutation: ADD_LOAN_INSTALMENT,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    }
  } catch (e) {
    vueObj.message = e;
  }
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

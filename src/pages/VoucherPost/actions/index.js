import {
  UPDATE_POST_VOUCHER,
  ADD_POST_VOUCHER,
  GET_VOUCHER_POST,
  DELETE_POST_VOUCHER,
  GET_VOUCHERS_BY_GROUPID,
  GET_ACCOUNTS_CHILDS,
  GET_ACCOUNT_HOLDERS,
  ADD_ACCOUNT_HOLDER,
  DELETE_ACCOUNT_HOLDER,
  UPDATE_ACCOUNT_HOLDER,
  GET_ACCOUNT_HOLDERS_BY_ID
} from "../../../graphql/quries";
import { omitTypeOff } from "../../../utils/helpers";

export async function addUpdateVouchers(vueObj) {
  vueObj.mutationLoading = true;
  const variables = {
    voucher_date: vueObj.voucherPostDate,
    voucher_type: vueObj.voucherType,
    data: omitTypeOff(vueObj.voucherGroup)
  };
  try {
    const result = await vueObj.$apollo.mutate({
      mutation: vueObj.isEditMode ? UPDATE_POST_VOUCHER : ADD_POST_VOUCHER,
      variables: vueObj.isEditMode
        ? {
            ...variables,
            acc_master_id: Number(vueObj.voucherGroupId)
          }
        : variables,
      fetchPolicy: "network-only"
    });
    if (result.errors) {
      throw result.errors[0].message;
    }
    !vueObj.isEditMode &&
      (await vueObj.$apollo.query({
        query: GET_VOUCHER_POST
      }));

    vueObj.isEditMode &&
      (await vueObj.$apollo.query({
        query: GET_VOUCHERS_BY_GROUPID,
        variables: {
          id: Number(vueObj.voucherGroupId)
        }
      }));
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.mutationLoading = false;
}

export async function deleteVouchers(vueObj) {
  vueObj.delLoading = true;
  const variables = {
    id: Number(vueObj.voucherGroupId)
  };
  try {
    const result = await vueObj.$apollo.mutate({
      mutation: DELETE_POST_VOUCHER,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.delLoading = false;
}

export async function getVoucherByGroupId(vueObj) {
  const result = await vueObj.$apollo.query({
    query: GET_VOUCHERS_BY_GROUPID,
    variables: {
      id: Number(vueObj.voucherGroupId)
    }
  });
  vueObj.voucherGroup = result.data.getAccountVouchers.vouchers;
  vueObj.voucherPostDate =
    result.data.getAccountVouchers.group_details.voucher_date;
  vueObj.voucherType =
    result.data.getAccountVouchers.group_details.voucher_type;
}

export async function getVoucherByDate(vueObj) {
  const result = await vueObj.$apollo.query({
    query: GET_VOUCHER_POST,
    variables: {
      voucher_date: vueObj.filterDate
    }
  });
  vueObj.vouchersGroups = result.data.getGroupVouchers;
}

export async function getAccountChilds(vueObj, item) {
  const result = await vueObj.$apollo.query({
    query: GET_ACCOUNTS_CHILDS,
    variables: {
      acc_parent: item.acc_code_id
    }
  });
  vueObj.accounts_child = result.data.getAccountChilds;
}

export async function fetchAccountHolders(vueObj) {
  const result = await vueObj.$apollo.query({
    query: GET_ACCOUNT_HOLDERS
  });
  vueObj.accountHoldersData = result.data.getAccountHolders;
}

export async function newAccountHolder(vueObj) {
  console.log("mutation called waiting for response");
  vueObj.loading = true;
  const variables = {
    ...vueObj.dataFromInputs
  };
  try {
    const result = await vueObj.$apollo.mutate({
      mutation: ADD_ACCOUNT_HOLDER,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackbarSuccess = true;
    }
  } catch (e) {
    vueObj.snackbar = true;
    vueObj.message = e;
  }
  vueObj.loading = false;
}

export async function deleteAccountHolder(vueObj) {
  const variables = {
    id: vueObj.id
  };
  try {
    const result = await vueObj.$apollo.mutate({
      mutation: DELETE_ACCOUNT_HOLDER,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    }
  } catch (e) {
    vueObj.message = e;
  }
}

export async function updateAccountHolder(vueObj) {
  vueObj.loading = true;
  const variables = {
    ...vueObj.dataFromInputs
  };
  try {
    const result = await vueObj.$apollo.mutate({
      mutation: UPDATE_ACCOUNT_HOLDER,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.loading = false;
}

export async function getAccountHolderById(vueObj) {
  const variables = {
    id: vueObj.editId
  };
  // debugger
  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNT_HOLDERS_BY_ID,
      variables: variables
      // fetchPolicy: "cache-and-network"
    });
    console.log("Result", result);
    vueObj.editAccountDetails = result.data.getAccountHolderById;
    console.log(result.data.getAccountHolderById, "ACTUAL DATA");
    console.log(vueObj.editAccountDetails, "from actions");
    vueObj.dialogPopUp = true;
    if (result.errors) {
      throw result.errors[0].message;
    }
  } catch (e) {
    vueObj.message = e;
  }
}

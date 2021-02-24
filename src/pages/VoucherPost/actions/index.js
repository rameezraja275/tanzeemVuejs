import {
  UPDATE_POST_VOUCHER,
  ADD_POST_VOUCHER,
  GET_VOUCHER_POST,
  DELETE_POST_VOUCHER,
  GET_VOUCHERS_BY_GROUPID,
  GET_ACCOUNTS_CHILDS
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
    } else {
      vueObj.message = "Account added successfully";
      vueObj.snackBarColor = "success";
      vueObj.snackbar = true;
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
    var temp = e.message.split(" ");
    temp.slice(0, 3);
    temp = temp.join(" ");
    vueObj.message = temp;
    vueObj.snackBarColor = "red";
    vueObj.snackbar = true;
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
  vueObj.tableLoading = true;
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

  vueObj.tableLoading = false;
}

export async function getVoucherByDate(vueObj) {
  vueObj.loading = true;
  try {
    const result = await vueObj.$apollo.query({
      query: GET_VOUCHER_POST,
      variables: {
        voucher_date: vueObj.filterDate
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.vouchersGroups = result.data.getGroupVouchers;
      vueObj.loading = false;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.loading = false;
  }
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

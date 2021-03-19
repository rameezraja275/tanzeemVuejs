import {
  UPDATE_POST_VOUCHER,
  ADD_POST_VOUCHER,
  GET_VOUCHER_POST,
  DELETE_POST_VOUCHER,
  GET_VOUCHERS_BY_GROUPID,
  GET_ACCOUNTS_CHILDS,
  GET_ACCOUNTS
} from "../../../graphql/quries";
import {
  omitTypeOff,
  removeGraphQlTagFromErrors
} from "../../../utils/helpers";
import { GROUP_ACCOUNTS } from "../../../utils/constants";

export async function addUpdateVouchers(vueObj) {
  vueObj.mutationLoading = true;
  const temp = [];
  for (var i = 0; i < vueObj.voucherGroup.length; i++) {
    temp[i] = {};
    for (var prop in vueObj.voucherGroup[i]) {
      temp[i][prop] = vueObj.voucherGroup[i][prop];
    }
  }
  temp.forEach(element => {
    delete element.acc_code;
    if (vueObj.isEditMode) {
      element.acc_master_id = Number(vueObj.voucherGroupId);
    }
  });
  const variables = {
    voucher_date: vueObj.voucherPostDate,
    voucher_type: vueObj.voucherType,
    data: omitTypeOff(temp)
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
      update: (cache, { data: { addAccountVoucher } }) => {
        const temp = new Date().toISOString().substr(0, 10);
        if (!vueObj.isEditMode && vueObj.voucherPostDate == temp) {
          const currentData = cache.readQuery({
            query: GET_VOUCHER_POST,
            variables: {
              voucher_date: vueObj.voucherPostDate
            }
          });
          cache.writeQuery({
            query: GET_VOUCHER_POST,
            variables: {
              voucher_date: vueObj.voucherPostDate
            },
            data: {
              getGroupVouchers: [
                ...currentData.getGroupVouchers,
                addAccountVoucher
              ]
            }
          });
        }
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.message = "Account added successfully";
      vueObj.snackBarColor = "success";
      vueObj.snackbar = true;
      const temp = new Date().toISOString().substr(0, 10);
      if (vueObj.filterVoucherByDate) {
        if (
          !vueObj.isEditMode &&
          vueObj.voucherPostDate == vueObj.filterVoucherByDate
        ) {
          vueObj.addNewVoucherToList(result.data.addAccountVoucher);
        }
        if (
          vueObj.isEditMode &&
          vueObj.voucherPostDate !== vueObj.filterVoucherByDate
        ) {
          vueObj.removeFromList(vueObj.voucherGroupId);
        }
      } else {
        if (!vueObj.isEditMode && vueObj.voucherPostDate == temp) {
          vueObj.addNewVoucherToList(result.data.addAccountVoucher);
        }
        if (vueObj.isEditMode && vueObj.voucherPostDate !== temp) {
          vueObj.removeFromList(vueObj.voucherGroupId);
        }
      }
      vueObj.$router.push({ path: `/voucherpost` });
      vueObj.onClear();
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
    console.log(e, "error");
    vueObj.snackBarColor = "red";
    // var newText = e.toString();
    // newText = newText.replace("Error: GraphQL error: ", "");
    vueObj.message = removeGraphQlTagFromErrors(e);
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
      variables: variables,
      update: cache => {
        console.log(vueObj.voucherPostDate, "date in delete");
        let currentData = cache.readQuery({
          query: GET_VOUCHER_POST,
          variables: {
            voucher_date: vueObj.voucherPostDate
          }
        });
        let temp = [...currentData.getGroupVouchers];
        currentData.getGroupVouchers.forEach((element, index) => {
          if (element.id === variables.id) {
            temp.splice(index, 1);
          }
        });
        cache.writeQuery({
          query: GET_VOUCHER_POST,
          variables: {
            voucher_date: vueObj.voucherPostDate
          },
          data: {
            getGroupVouchers: [...temp]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackBarColor = "success";
      vueObj.message = "Successfully deleted Voucher";
      vueObj.snackbar = true;
      vueObj.removeFromList(vueObj.voucherGroupId);
      vueObj.onClear();
      if (vueObj.$route.params.newRoute.params.vpid) {
        vueObj.$router.push({ path: `/voucherpost` });
      }
      vueObj.closeDelete();
    }
  } catch (e) {
    vueObj.snackBarColor = "red";
    // var newText = e.toString();
    // newText = newText.replace("Error: GraphQL error: ", "");
    vueObj.message = removeGraphQlTagFromErrors(e);
    vueObj.snackbar = true;
  }
  vueObj.delLoading = false;
}

export async function getVoucherByGroupId(vueObj) {
  vueObj.tableLoading = true;
  try {
    const result = await vueObj.$apollo.query({
      query: GET_VOUCHERS_BY_GROUPID,
      variables: {
        id: Number(vueObj.voucherGroupId)
      },
      fetchPolicy: "network-only"
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.voucherGroup = result.data.getAccountVouchers.vouchers;
      vueObj.voucherPostDate =
        result.data.getAccountVouchers.group_details.voucher_date;
      vueObj.voucherType =
        result.data.getAccountVouchers.group_details.voucher_type;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.tableLoading = false;
}

export async function getVoucherByDate(vueObj) {
  vueObj.loading = true;
  try {
    const result = await vueObj.$apollo.query({
      query: GET_VOUCHER_POST,
      variables: {
        voucher_date: vueObj.filterDate
      },
      fetchPolicy: "network-only"
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      // vueObj.vouchersGroups = result.data.getGroupVouchers;
      vueObj.voucherGroupsList(result.data.getGroupVouchers);
      vueObj.loading = false;
    }
  } catch (e) {
    vueObj.message = e;
    var temp = e.toString();
    vueObj.snackBarColor = "red";
    vueObj.snackBarText = temp;
    vueObj.snackBarModel = true;
    vueObj.loading = false;
  }
}

export async function getAccountChilds(vueObj, item) {
  if (vueObj.accounts.length > 0) {
    vueObj.selectLoadingSubAc = true;
  }
  const result = await vueObj.$apollo.query({
    query: GET_ACCOUNTS_CHILDS,
    variables: {
      acc_parent: item.acc_code_id
    }
  });
  vueObj.accounts_child = result.data.getAccountChilds;
  vueObj.selectLoadingSubAc = false;
}

export async function getGroupAccounts(vueObj) {
  vueObj.selectLoadingACCode = true;
  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNTS,
      variables: {
        acc_type: GROUP_ACCOUNTS
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.accounts = result.data.getAccounts;
    }
  } catch (error) {
    vueObj.message = error;
  }
  vueObj.selectLoadingACCode = false;
}

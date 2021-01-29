import {
  UPDATE_POST_VOUCHER,
  ADD_POST_VOUCHER,
  GET_VOUCHER_POST,
  DELETE_POST_VOUCHER,
  GET_VOUCHERS_BY_GROUPID,
  GET_ACCOUNTS_CHILDS,
  GET_ACCOUNT_HOLDERS,
  ADD_ACCOUNT_HOLDER
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

// export async function newAccountHolder(vueObj) {
//   const variables = {
//     acc_code: vueObj.dataFromInputs1.accountCode,
//     acc_code_id: vueObj.dataFromInputs1.accountCodeId,
//     acc_no: vueObj.dataFromInputs1.accountNumber,
//     first_name: vueObj.dataFromInputs1.firstName,
//     middle_name: vueObj.dataFromInputs1.middleName,
//     last_name: vueObj.dataFromInputs1.lastName,
//     guardian_type: vueObj.dataFromInputs1.guardianType,
//     guardian_name: vueObj.dataFromInputs1.guardianName,
//     cell: vueObj.dataFromInputs1.cellPhone,
//     landline_no: vueObj.dataFromInputs1.landLineNumber,
//     cnic: vueObj.dataFromInputs1.cnic,
//     gender: vueObj.dataFromInputs1.gender,
//     dob: vueObj.dataFromInputs1.dateOfBirth,
//     address: vueObj.dataFromInputs1.address,
//     opening_date: vueObj.dataFromInputs1.accountOpeningDate,
//     guarantor: []
//   };
//   try {
//     const result = await vueObj.$apollo.mutate({
//       mutation: ADD_ACCOUNT_HOLDER,
//       variables: variables
//     });
//     if (result.errors) {
//       throw result.errors[0].message;
//     }
//   } catch (e) {
//     vueObj.message = e;
//   }
// }

import {
  GET_ACCOUNT_HOLDERS,
  ADD_ACCOUNT_HOLDER,
  DELETE_ACCOUNT_HOLDER,
  UPDATE_ACCOUNT_HOLDER,
  GET_ACCOUNT_HOLDERS_BY_ID
} from "../../../graphql/quries";

export async function fetchAccountHolders(vueObj) {
  const result = await vueObj.$apollo.query({
    query: GET_ACCOUNT_HOLDERS,
    fetchPolicy: "network-only"
  });
  vueObj.accountHoldersData = result.data.getAccountHolders;
}

export async function newAccountHolder(vueObj) {
  vueObj.loading = true;
  console.log(vueObj.dataFromInputs, "datra before sending");
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
    } else {
      vueObj.deleteAlert = true;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackbar = true;
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
    } else {
      const result = await vueObj.$apollo.query({
        query: GET_ACCOUNT_HOLDERS,
        fetchPolicy: "network-only"
      });
      vueObj.accountHoldersData = result.data.getAccountHolders;
      console.log(vueObj.accountHoldersData, "received data");
      vueObj.editDataAlert = true;
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackbar = true;
  }
  vueObj.loading = false;
}

export async function getAccountHolderById(vueObj, itemID) {
  const variables = {
    id: itemID
  };
  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNT_HOLDERS_BY_ID,
      variables: variables,
      fetchPolicy: "no-cache"
    });
    vueObj.editAccountDetails = result.data.getAccountHolderById;
    vueObj.dialogPopUp = true;

    if (result.errors) {
      throw result.errors[0].message;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.loading = false;
  vueObj.editingMode = false;
}

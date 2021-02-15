import {
  GET_ACCOUNT_HOLDERS,
  ADD_ACCOUNT_HOLDER,
  DELETE_ACCOUNT_HOLDER,
  UPDATE_ACCOUNT_HOLDER,
  GET_ACCOUNT_HOLDERS_BY_ID
} from "../../../graphql/quries";

export async function fetchAccountHolders(vueObj) {
  vueObj.tableLoading = true;
  try {
    const result = await vueObj.$apollo.query({
      query: GET_ACCOUNT_HOLDERS,
      fetchPolicy: "network-only"
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.accountHoldersData = result.data.getAccountHolders;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.tableLoading = false;
}

export async function newAccountHolder(vueObj) {
  vueObj.btnLoader = true;
  const variables = {
    ...vueObj.dataFromInputs
  };
  variables.guarantor.forEach(element => {
    if (element.acc_no_id == null) {
      element.acc_no_id = 0;
    }
  });
  try {
    const result = await vueObj.$apollo.mutate({
      mutation: ADD_ACCOUNT_HOLDER,
      variables: variables
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      // vueObj.snackbarSuccess = true;
      vueObj.snackBarText = "Successfully added new account holder";
      vueObj.snackBarColor = "success";
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    var error = e.toString();
    error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackBarText = error;
  }
  vueObj.btnLoader = false;
  vueObj.snackBarModel = true;
}

export async function deleteAccountHolder(vueObj) {
  vueObj.tableLoading = true;
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
      vueObj.snackBarText = "Successfully deleted account holder";
      vueObj.snackBarColor = "success";
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    var error = e.toString();
    error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackBarText = error;
  }
  vueObj.snackBarModel = true;
  vueObj.tableLoading = false;
}

export async function updateAccountHolder(vueObj) {
  vueObj.btnLoader = true;
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
      vueObj.snackBarText = "Successfully updated account holder";
      vueObj.snackBarColor = "success";
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.message = e;
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    var error = e.toString();
    error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackBarText = error;
  }

  vueObj.snackBarModel = true;
  vueObj.btnLoader = false;
}

export async function getAccountHolderById(vueObj, itemID) {
  vueObj.tableLoading = true;
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
  vueObj.tableLoading = false;
}

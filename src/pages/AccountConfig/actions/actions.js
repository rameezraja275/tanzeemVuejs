import {
  GET_ACCOUNT_HOLDERS,
  ADD_ACCOUNT_HOLDER,
  DELETE_ACCOUNT_HOLDER,
  UPDATE_ACCOUNT_HOLDER,
  GET_ACCOUNT_HOLDERS_BY_ID
} from "../../../graphql/quries";
import {
  removeGraphQlTagFromErrors,
  omitTypeOff
} from "../../../utils/helpers";

export async function fetchAccountHolders(vueObj) {
  vueObj.slctLoadingOnAcHolders = true;
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
    var temp = e.toString();
    vueObj.snackBarText = temp;
    vueObj.snackBarColor = "red";
    vueObj.snackBarModel = true;
  }
  vueObj.tableLoading = false;
  vueObj.slctLoadingOnAcHolders = false;
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
      variables: variables,
      update: (cache, { data: { addAccountHolder } }) => {
        let accountHolders = cache.readQuery({
          query: GET_ACCOUNT_HOLDERS
        });
        cache.writeQuery({
          query: GET_ACCOUNT_HOLDERS,
          data: {
            getAccountHolders: [
              ...accountHolders.getAccountHolders,
              addAccountHolder
            ]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.accountHoldersData.push(result.data.addAccountHolder);
      vueObj.snackBarText = "Successfully added new account holder";
      vueObj.snackBarColor = "success";
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    // var error = e.toString();
    // error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackBarText = removeGraphQlTagFromErrors(e);
  }
  vueObj.btnLoader = false;
  vueObj.snackBarModel = true;
}

export async function deleteAccountHolder(vueObj, deleteIndex) {
  vueObj.tableLoading = true;
  const variables = {
    id: vueObj.id
  };
  try {
    const result = await vueObj.$apollo.mutate({
      mutation: DELETE_ACCOUNT_HOLDER,
      variables: variables,
      update: (cache, { data: { result } }) => {
        let data = cache.readQuery({
          query: GET_ACCOUNT_HOLDERS
        });
        let temp = [...data.getAccountHolders];
        data.getAccountHolders.forEach((element, index) => {
          if (element.id == vueObj.id) {
            temp.splice(index, 1);
          }
        });
        cache.writeQuery({
          query: GET_ACCOUNT_HOLDERS,
          data: {
            getAccountHolders: [...temp]
          }
        });
        vueObj.removeItemFromList(deleteIndex);
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackBarText = "Successfully deleted account holder";
      vueObj.snackBarColor = "success";
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    // var error = e.toString();
    // error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackBarText = removeGraphQlTagFromErrors(e);
  }
  vueObj.snackBarModel = true;
  vueObj.tableLoading = false;
}

export async function updateAccountHolder(vueObj, editedIndex) {
  vueObj.btnLoader = true;
  const variables = {
    ...vueObj.dataFromInputs
  };
  try {
    const result = await vueObj.$apollo.mutate({
      mutation: UPDATE_ACCOUNT_HOLDER,
      variables: variables,
      update: (cache, { data: { updateAccountHolder } }) => {
        let data = cache.readQuery({
          query: GET_ACCOUNT_HOLDERS
        });
        let temp = [...data.getAccountHolders];
        data.getAccountHolders.forEach((element, index) => {
          if (element.id == vueObj.id) {
            temp[index] = updateAccountHolder;
          }
        });
        cache.writeQuery({
          query: GET_ACCOUNT_HOLDERS,
          data: {
            getAccountHolders: [...temp]
          }
        });
      }
    });
    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.snackBarText = "Successfully updated account holder";
      vueObj.snackBarColor = "success";
      vueObj.updateList(editedIndex, variables);
    }
  } catch (e) {
    vueObj.message = e;
    vueObj.snackBarColor = "red";
    // var error = e.toString();
    // error = error.replace("Error: GraphQL error: ", "");
    vueObj.snackBarText = removeGraphQlTagFromErrors(e);
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

    if (result.errors) {
      throw result.errors[0].message;
    } else {
      vueObj.editAccountDetails = omitTypeOff(result.data.getAccountHolderById);
      vueObj.dialogPopUp = true;
    }
  } catch (e) {
    vueObj.message = e;
  }
  vueObj.tableLoading = false;
}

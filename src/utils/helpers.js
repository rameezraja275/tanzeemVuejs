import localStorage from "./localStorageService";
const localStorageService = localStorage.getService();

export const validateToken = () => {
  const token = localStorageService.getAccessToken();

  if (token) return true;
  return false;
};

export const omitTypeOff = data => {
  const omitTypename = (key, value) =>
    key === "__typename" ? undefined : value;
  const parsedData = JSON.parse(JSON.stringify(data), omitTypename);
  return parsedData;
};

export const removeGraphQlTagFromErrors = data => {
  var error = data.toString();
  error = error.replace("Error: GraphQL error: ", "");
  return error;
};

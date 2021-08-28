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

export const isValidDate = dateString => {
  // First check for the pattern
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
    return false;
  } else {
    return true;
  }
};

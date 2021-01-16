import localStorage from "./localStorageService";
const localStorageService = localStorage.getService();

export const validateToken = () => {
  const token = localStorageService.getAccessToken();

  if (token) return true;
  return false;
};

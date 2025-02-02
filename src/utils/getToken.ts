import { LocalStorageKeys } from '../configs/localStorageKeys';

/**
 * @description returns token if exists else returns empty string
 */
export const getToken = () => {
  let token = '';
  const headerData = localStorage.getItem(LocalStorageKeys.TOKEN);
  if (headerData) {
    token = JSON.parse(headerData);
  }
  return token;
};

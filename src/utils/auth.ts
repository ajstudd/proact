// utils/auth.ts

export const setAuthData = (token: string, user: any) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(user));
  };
  
  export const getAuthToken = (): string | null => {
    return localStorage.getItem("authToken");
  };
  
  export const getUserData = (): any | null => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  };
  
  export const clearAuthData = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };
  
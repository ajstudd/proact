import { useSelector } from "react-redux";
import { RootState } from "../store";
import { getAuthToken, getCurrentUserId } from "../utils/authUtils";

/**
 * Custom hook for accessing current user data and authentication status
 * across the application
 */
export const useCurrentUser = () => {
  const user = useSelector((state: RootState) => state.userSlice);
  console.log("user", user);

  // Get fresh token and userId every time the hook is called
  const token = getAuthToken();
  const userId = getCurrentUserId();

  // Determine authentication status
  const isAuthenticated = Boolean(token) && user.isAuthenticated;

  return {
    user,
    userId,
    token,
    isAuthenticated,
    role: user.role || "USER",
    // Shorthand helpers for role checking
    isAdmin: user.role === "ADMIN",
    isContractor: user.role === "CONTRACTOR",
    isGovernment: user.role === "GOVERNMENT",
  };
};

export default useCurrentUser;

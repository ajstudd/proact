import { useUpdateUserMutation } from '../services/userApi';

export const useUser = () => {
  const [
    updateUser,
    {
      data: userUpdateData,
      error: userUpdateError,
      isError: isUserUpdateError,
      isLoading: isUserUpdateLoading,
      isSuccess: isUserUpdateSuccess,
    },
  ] = useUpdateUserMutation();

  return {
    // updateUser,
    updateUser,
    isUserUpdateLoading,
    isUserUpdateError,
    isUserUpdateSuccess,
    userUpdateData,
    userUpdateError,
  };
};

import {
  useUpdateUserMutation,
  useEditProfileMutation,
  useVerifyEmailChangeMutation,
} from "../services/userApi";

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

  const [
    editProfile,
    {
      data: editProfileData,
      error: editProfileError,
      isError: isEditProfileError,
      isLoading: isEditProfileLoading,
      isSuccess: isEditProfileSuccess,
    },
  ] = useEditProfileMutation();

  const [
    verifyEmail,
    {
      data: verifyEmailData,
      error: verifyEmailError,
      isError: isVerifyEmailError,
      isLoading: isVerifyEmailLoading,
      isSuccess: isVerifyEmailSuccess,
    },
  ] = useVerifyEmailChangeMutation();

  return {
    updateUser,
    isUserUpdateLoading,
    isUserUpdateError,
    isUserUpdateSuccess,
    userUpdateData,
    userUpdateError,

    editProfile,
    isEditProfileLoading,
    isEditProfileError,
    isEditProfileSuccess,
    editProfileData,
    editProfileError,

    verifyEmail,
    isVerifyEmailLoading,
    isVerifyEmailError,
    isVerifyEmailSuccess,
    verifyEmailData,
    verifyEmailError,
  };
};

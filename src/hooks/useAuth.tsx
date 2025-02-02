// import { LocalStorageKeys } from '@/configs/localStorageKeys';
// import {
//   useLoginMutation,
//   useLogoutMutation,
//   useNewAccessTokenMutation,
//   useRegisterMutation,
//   useForgotPasswordMutation,
//   useResetPasswordMutation,
//   useMeMutation,
// } from '@/services/authApi';
// import {
//   ALL_ROUTES,
//   LoginAuthRequestPayload,
//   RegisterUserRequestPayload,
//   UserAuthResponsePayload,
// } from '@/types';
// import {
//   FC,
//   PropsWithChildren,
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';
// import jwtDecode from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';

// interface IAuthContext extends UserAuthResponsePayload {
//   isInitialized: boolean;
//   isAuthenticated: boolean;
//   login: (payload: LoginAuthRequestPayload) => Promise<UserAuthResponsePayload>;
//   logout: () => Promise<void>;
//   // newAccessToken: () => Promise<void>;
//   register: (
//     payload: RegisterUserRequestPayload
//   ) => Promise<UserAuthResponsePayload>;
//   initAuth: () => Promise<void>;
//   setInitialized: (value: boolean) => void;
//   getDecodedAccessToken: () => any;
//   forgotPassword: (email: string) => Promise<any>;
//   resetPassword: (payload: any) => Promise<any>;

//   loginData: UserAuthResponsePayload | undefined;
//   loginError: any;
//   isLoginError: boolean;
//   isLoggingIn: boolean;

//   registerData: UserAuthResponsePayload | undefined;
//   registerError: any;
//   isRegisterError: boolean;
//   isRegistering: boolean;

//   logoutData: any;
//   logoutError: any;
//   isLogoutError: boolean;
//   isLoggingOut: boolean;

//   newAcessTokenData: any;
//   newAccessTokenError: any;
//   isNewAcessTokenError: boolean;
//   isNewAccessTokenLoading: boolean;

//   forgotPasswordData: any;
//   forgotPasswordError: any;
//   isForgotPasswordError: boolean;
//   isForgotPasswordLoading: boolean;

//   resetPasswordData: any;
//   resetPasswordError: any;
//   isResetPasswordError: boolean;
//   isResetPasswordLoading: boolean;
// }

// const initialState: UserAuthResponsePayload = {
//   user: {
//     email: '',
//     name: '',
//     id: '',
//     role: {
//       id: 1,
//       label: '',
//       scopes: [],
//     },
//     subscription: '',
//   },
//   tokens: {
//     access: {
//       token: '',
//       expires: new Date(),
//     },
//     refresh: {
//       token: '',
//       expires: new Date(),
//     },
//   },
// };

// const AuthContext = createContext<IAuthContext>({
//   ...initialState,
//   isInitialized: false,
//   isAuthenticated: false,
//   login: async () => ({} as UserAuthResponsePayload),
//   logout: async () => {},
//   // newAccessToken: async () => {},
//   register: async () => ({} as UserAuthResponsePayload),
//   initAuth: async () => {},
//   setInitialized: () => {},
//   getDecodedAccessToken: () => ({}),
//   forgotPassword: async () => ({} as any),
//   resetPassword: async () => ({} as any),
//   loginData: undefined,
//   loginError: undefined,
//   isLoginError: false,
//   isLoggingIn: false,

//   registerData: undefined,
//   registerError: undefined,
//   isRegisterError: false,
//   isRegistering: false,

//   logoutData: undefined,
//   logoutError: undefined,
//   isLogoutError: false,
//   isLoggingOut: false,

//   newAcessTokenData: undefined,
//   newAccessTokenError: undefined,
//   isNewAcessTokenError: false,
//   isNewAccessTokenLoading: false,

//   forgotPasswordData: undefined,
//   forgotPasswordError: undefined,
//   isForgotPasswordError: false,
//   isForgotPasswordLoading: false,

//   resetPasswordData: undefined,
//   resetPasswordError: undefined,
//   isResetPasswordError: false,
//   isResetPasswordLoading: false,
// });

// export const AuthProvider: FC<PropsWithChildren> = props => {
//   const [isInitialized, setInitialized] = useState<boolean>(false);
//   const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
//   const [userAuthData, setUserAuthData] =
//     useState<UserAuthResponsePayload>(initialState);
//   const [resetToken, setResetToken] = useState<string>('');

//   const [
//     forgotPassword,
//     {
//       data: forgotPasswordData,
//       error: forgotPasswordError,
//       isError: isForgotPasswordError,
//       isLoading: isForgotPasswordLoading,
//     },
//   ] = useForgotPasswordMutation();

//   const [
//     resetPassword,
//     {
//       data: resetPasswordData,
//       error: resetPasswordError,
//       isError: isResetPasswordError,
//       isLoading: isResetPasswordLoading,
//     },
//   ] = useResetPasswordMutation();

//   const [
//     loginMutation,
//     {
//       data: loginData,
//       error: loginError,
//       isError: isLoginError,
//       isLoading: isLoggingIn,
//     },
//   ] = useLoginMutation();
//   const [
//     registerMutation,
//     {
//       data: registerData,
//       error: registerError,
//       isError: isRegisterError,
//       isLoading: isRegistering,
//     },
//   ] = useRegisterMutation();
//   const [
//     logoutMutation,
//     {
//       data: logoutData,
//       error: logoutError,
//       isError: isLogoutError,
//       isLoading: isLoggingOut,
//     },
//   ] = useLogoutMutation();

//   const [
//     nat,
//     {
//       data: newAcessTokenData,
//       error: newAccessTokenError,
//       isError: isNewAcessTokenError,
//       isLoading: isNewAccessTokenLoading,
//     },
//   ] = useNewAccessTokenMutation();

//   const navigate = useNavigate();

//   const [getMe] = useMeMutation();

//   const initAuth = async () => {
//     if (isInitialized) {
//       return;
//     }

//     const authData = localStorage.getItem(LocalStorageKeys.AUTH_DATA);
//     console.log('authData', authData);
//     if (authData !== null) {
//       const { tokens, user } = JSON.parse(authData) as UserAuthResponsePayload;

//       if (!tokens.access || !tokens.refresh) {
//         localStorage.removeItem(LocalStorageKeys.AUTH_DATA);
//         navigate(ALL_ROUTES.HOMEPAGE);
//         return;
//       }

//       if (tokens.access.token.length > 0 && tokens.refresh.token.length > 0) {
//         const decodedAccessToken = jwtDecode<any>(tokens.access.token);
//         const decodedRefreshToken = jwtDecode<any>(tokens.refresh.token);

//         const isAccessTokenExpired = decodedAccessToken.exp < Date.now() / 1000;
//         const isRefreshTokenExpired =
//           decodedRefreshToken.exp < Date.now() / 1000;

//         if (isAccessTokenExpired && isRefreshTokenExpired) {
//           // * Change path if required
//           setInitialized(true);
//           localStorage.removeItem(LocalStorageKeys.AUTH_DATA);
//           navigate(ALL_ROUTES.HOMEPAGE);
//           return;
//         }

//         try {
//           const me = await getMe(tokens.access.token).unwrap();
//           setUserAuthData({ user: me.user, tokens });
//           localStorage.setItem(
//             LocalStorageKeys.AUTH_DATA,
//             JSON.stringify({ user: me.user, tokens })
//           );
//           setAuthenticated(true);
//         } catch (err) {
//           localStorage.removeItem(LocalStorageKeys.AUTH_DATA);
//           // * Change path if required
//           navigate(ALL_ROUTES.HOMEPAGE);
//         }
//         // }
//       }
//     }
//     setInitialized(true);
//   };

//   const login = async (
//     payload: LoginAuthRequestPayload
//   ): Promise<UserAuthResponsePayload> => {
//     const { tokens, user } = await loginMutation(payload).unwrap();
//     setUserAuthData({ user, tokens });
//     localStorage.setItem(
//       LocalStorageKeys.AUTH_DATA,
//       JSON.stringify({ user, tokens })
//     );
//     setAuthenticated(true);
//     return { user, tokens };
//   };

//   const logout = async () => {
//     await logoutMutation(userAuthData.tokens.refresh.token).unwrap();
//     setUserAuthData(initialState);
//     localStorage.removeItem(LocalStorageKeys.AUTH_DATA);
//     setAuthenticated(false);
//   };

//   const register = async (
//     payload: RegisterUserRequestPayload
//   ): Promise<UserAuthResponsePayload> => {
//     const { tokens, user } = await registerMutation(payload).unwrap();
//     setUserAuthData({ user, tokens });
//     localStorage.setItem(
//       LocalStorageKeys.AUTH_DATA,
//       JSON.stringify({ user, tokens })
//     );
//     setAuthenticated(true);
//     return { user, tokens };
//   };

//   // const newAccessToken = async () => {
//   //   const { access, refresh } = await nat(
//   //     userAuthData.tokens.refresh.token
//   //   ).unwrap();
//   //   setUserAuthData({ ...userAuthData, tokens: { access, refresh } });
//   //   localStorage.setItem(
//   //     LocalStorageKeys.AUTH_DATA,
//   //     JSON.stringify({ ...userAuthData, tokens: { access, refresh } })
//   //   );
//   //   setAuthenticated(true);
//   // };

//   const getDecodedAccessToken = () => {
//     const authData = localStorage.getItem(LocalStorageKeys.AUTH_DATA);
//     if (authData !== null) {
//       const { tokens } = JSON.parse(authData) as UserAuthResponsePayload;
//       if (tokens.access.token.length > 0) {
//         const decodedAccessToken = jwtDecode<any>(tokens.access.token);
//         return decodedAccessToken;
//       }
//     }
//     return null;
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         ...userAuthData,
//         isInitialized,
//         isAuthenticated,
//         login,
//         logout,
//         // newAccessToken,
//         register,
//         initAuth,
//         setInitialized,
//         getDecodedAccessToken,
//         forgotPassword,
//         resetPassword,

//         loginData,
//         loginError,
//         isLoginError,
//         isLoggingIn,

//         registerData,
//         registerError,
//         isRegisterError,
//         isRegistering,

//         logoutData,
//         logoutError,
//         isLogoutError,
//         isLoggingOut,

//         newAcessTokenData,
//         newAccessTokenError,
//         isNewAcessTokenError,
//         isNewAccessTokenLoading,

//         forgotPasswordData,
//         forgotPasswordError,
//         isForgotPasswordError,
//         isForgotPasswordLoading,

//         resetPasswordData,
//         resetPasswordError,
//         isResetPasswordError,
//         isResetPasswordLoading,
//       }}
//     >
//       {props.children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

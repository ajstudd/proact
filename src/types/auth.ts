export interface TokenPayload {
  token: string;
  expires: Date;
}

export interface Role {
  id: number;
  label: string;
  scopes: string[];
}

export interface User {
  name: string;
  email: string;
  role: Role;
  id: string;
  isVerified: boolean;
}

export interface Tokens {
  access: TokenPayload;
  refresh: TokenPayload;
}

export interface UserAuthResponsePayload {
  user: User;
  tokens: Tokens;
}

export interface UserAuthRequestPayload {
  name: string;
  email: string;
  phone: string;
  photo?: string;
  password: string;
}

export type LoginAuthRequestPayload = Pick<
  UserAuthRequestPayload,
  'email' | 'password'
>;

export interface LoginAuthResponsePayload {
  user: User;
  token: string;
}
export interface LoginSuccessResponsePayload {
  message: string;
  resp : LoginAuthResponsePayload;
};

// {
//   "message": "Login successful!",
//   "resp": {
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YjYyZjQwZDljMGM4ZTIxNTkwYjY0NyIsInJvbGUiOiJVU0VSIiwiaXNWZXJpZmllZCI6dHJ1ZSwiaWF0IjoxNzQwMjUyMjc4LCJleHAiOjE3NDI4NDQyNzh9.3GCBf4isD0PuEu0KX3Etmj-lIvIJEVbFilHkl2efnTU",
//       "user": {
//           "id": "67b62f40d9c0c8e21590b647",
//           "name": "junaid",
//           "email": "j7654894110@gmail.com",
//           "role": "USER",
//           "isVerified": true
//       }
//   }
// }



export interface VerifyOtpRequestPayload {
  otp: string;
  email?: string;
  phone?: string;
}

export interface RegisterUserRequestPayload  {
  email: string;
  phone: string;
  name: string;
  password: string;
  role: string;
}
// export interface RegisterUserRequestPayload extends UserAuthRequestPayload {
//   repeatPassword: string;
//   terms?: boolean;
//   marketing?: boolean;
// }

export interface ForgotPasswordRequestPayload {
  email: string;
}
export interface ResetPasswordRequestPayload {
  newPassword: string;
  repeatNewPassword: string;
}

export interface LoginPasswordPayload {
  email: string;
  password: string;
}
export interface LoginPasswordResponsePayload {
  message: string;
  token: string;
}

export interface RequestOtpRequestPayload {
  email: string;
  phone: string;
  method : string;
}
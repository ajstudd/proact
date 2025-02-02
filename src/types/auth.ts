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
  subscription: string;
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
  dial_code?: string;
  password: string;
}

export type LoginAuthRequestPayload = Pick<
  UserAuthRequestPayload,
  'email' | 'password'
>;


export interface LoginSuccessResponsePayload {
  message: string;
  token: string;
};


export interface VerifyOtpRequestPayload
  extends Pick<UserAuthRequestPayload, 'phone'> {
  otp: string;
}

export interface RegisterUserRequestPayload extends UserAuthRequestPayload {
  repeatPassword: string;
  terms?: boolean;
  marketing?: boolean;
}

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

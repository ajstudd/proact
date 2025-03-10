export * from "./common";
export * from "./auth";
export * from "./routes";
export * from "./colors";
export * from "./breakpoints";
export * from "./user";
export * from "./posts";

export interface IUserData {
  id: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role: "ADMIN" | "USER" | "CONTRACTOR" | "GOVERNMENT";
  photo?: string;
  isVerified: boolean;
  lastLogin?: Date;
  governmentId?: string;
  designation?: string;
  department?: string;
  contractorLicense?: string;
  contributions?: number;
  experience?: number;
  reputationScore?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  photo?: string;
  designation?: string;
  department?: string;
  experience?: number;
}

export interface UpdateUserResponse {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  // Include other updated fields
  photo?: string;
  role: string;
  isVerified: boolean;
  designation?: string;
  department?: string;
  experience?: number;
  reputationScore?: number;
}

export interface ErrorResponse {
  message: string;
  code?: number;
}

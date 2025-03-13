import { Role } from "./auth";

export interface IUser {
  name: string;
  password: string;
  phone: string;
  photo: string;
  email: string;
}

export interface TUser {
  _id?: string;
  phone: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  photo?: string;
  id?: string;
  email: string;
  bookmarks?: string[];
}

export interface ToUser {
  _id: string;
  role: String;
  phone: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  photo: string;
  id: string;
  email: string;
  bookmarks?: string[];
}

export interface IUserData {
  user: TUser;
}

export type UpdateUserPayload = Partial<IUser>;

export interface UpdateUserResponse {
  _id: string;
  email: string;
  role: Role;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  id: string;
  subscription: string;
  bookmarks?: string[];
}

export interface BookmarkedProject {
  _id: string;
  title: string;
  bannerUrl?: string;
  description: string;
  location: {
    place: string;
    coordinates?: [number, number];
  };
  budget?: number;
  contractor?: {
    _id: string;
    name: string;
  };
  government?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkResponse {
  message: string;
  bookmarks: BookmarkedProject[];
}

export interface BookmarkedProjectsResponse {
  bookmarks: BookmarkedProject[];
}

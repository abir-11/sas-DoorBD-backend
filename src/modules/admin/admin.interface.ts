import { Gender, Status } from "../../../prisma/generated/prisma/enums";


export interface ICreateUserPayload {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: Gender; 
  roleName: string;
}

export interface ICreator {
  id?: string;
  roleName?: string;
  role?: {
    roleName: string;
  };
}

export interface IUpdateUserPayload {
  name?: string;
  email?: string;
  phoneNumber?: string;
  gender?: string;
  roleName?: string;
  status?: Status
}

export interface IUserQuery {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
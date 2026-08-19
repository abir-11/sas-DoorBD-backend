import { Gender } from "../../../prisma/generated/prisma/enums";

export interface IUser {
  name: string;
  email?: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface IUpdateProfile {
  bio?: string;
  address?: string;
  gender?: Gender;
}

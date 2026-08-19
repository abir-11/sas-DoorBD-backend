import { CategoryStatus } from "../../../prisma/generated/prisma/enums";

export interface ICreateCategoryPayload {
  nameEn: string;
  nameBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  image?: string;
  status?: CategoryStatus;
  parentId?: string; 
}

export interface IUpdateCategoryPayload extends Partial<ICreateCategoryPayload> {}

export interface ICategoryFilterRequest {
  searchTerm?: string;
  status?: string;
  parentId?: string; 
}
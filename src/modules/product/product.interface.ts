import {  ProductStatus, } from "../../../prisma/generated/prisma/enums";

export interface ICreateProductPayload {
  language: "EN" | "BN"; 
  name: string;
  description: string;

  categoryId?: string;
  doorTypeId?: string;
  doorMaterialId?: string;
  doorOpeningId?: string;

  price: number;
  discountPrice?: number;
  stock?: number;
  status?: ProductStatus;
  badge?:string;
  deliveryType?:string;

  images: string[];
}
export interface IUpdateProductPayload extends Partial<ICreateProductPayload> {}

export interface IProductFilterRequest {
  searchTerm?: string;
  categoryId?: string;
  doorType?: string;
  material?: string;
  brand?: string;
  status?: string;
  isSmart?: string | boolean;
  isAvailable?: string | boolean;
  lockType?: string;
  securityLevel?: string;
  installationAvailable?: string | boolean;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
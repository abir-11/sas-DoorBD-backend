export interface IPermissionPayload {
  name: string;
  slug: string;
  module: string;
}

export interface IPermissionQuery {
  searchTerm?: string;
  module?: string;
}

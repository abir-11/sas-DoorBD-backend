import { Prisma } from '../../../prisma/generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { IPermissionPayload, IPermissionQuery } from './permission.interface';


const createPermissionDB = async (payload: IPermissionPayload) => {
  const isExist = await prisma.permission.findUnique({
    where: { slug: payload.slug },
  });

  if (isExist) {
    throw new Error(`Permission with slug '${payload.slug}' already exists!`);
  }

  const result = await prisma.permission.create({
    data: payload,
  });

  return result;
};

const getAllPermissions = async (
  query: IPermissionQuery
) => {
  const { searchTerm, module } = query;

  const andConditions: Prisma.PermissionWhereInput[] = [];

  // Search by name or slug
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Filter by module
  if (module) {
    andConditions.push({
      module: {
        equals: module,
      },
    });
  }

  const whereConditions: Prisma.PermissionWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  const permissions = await prisma.permission.findMany({
    where: whereConditions,
    orderBy: [
      {
        module: "asc",
      },
      {
        name: "asc",
      },
    ],
  });

  // Group permissions by module
  const groupedPermissions = permissions.reduce<Record<string, typeof permissions>>(
    (acc, permission) => {
      const modulePermissions = acc[permission.module] ?? [];
      modulePermissions.push(permission);
      acc[permission.module] = modulePermissions;

      return acc;
    },
    {}
  );

  return groupedPermissions;
};

const updatePermission = async (id: string, payload: Partial<IPermissionPayload>) => {
  const isExist = await prisma.permission.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new Error("Permission not found!");
  }

  if (payload.slug && payload.slug !== isExist.slug) {
    const isSlugTaken = await prisma.permission.findUnique({
      where: { slug: payload.slug },
    });
    if (isSlugTaken) {
      throw new Error( `Slug '${payload.slug}' is already in use!`);
    }
  }

  const result = await prisma.permission.update({
    where: { id },
    data: payload,
  });

  return result;
};


const getPermissionById = async (id: string) => {
  const result = await prisma.permission.findUnique({
    where: { id },
  });

  if (!result) {
    throw new Error( "Permission not found!");
  }

  return result;
};

const deletePermission = async (id: string) => {
  const isExist = await prisma.permission.findUnique({
    where: { id },
  });

  if (!isExist) {
    throw new Error( "Permission not found!");
  }

  const result = await prisma.permission.delete({
    where: { id },
  });

  return result;
};

export const permissionService = {
  createPermissionDB,
  getAllPermissions,
  updatePermission,
  getPermissionById,
  deletePermission
};
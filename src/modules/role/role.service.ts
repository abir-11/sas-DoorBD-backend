import { prisma } from '../../lib/prisma';



const createRoleWithPermissions = async (payload: {
  roleName: string;
  description: string;
  permissionSlugs: string[];
}) => {
  const { roleName, description, permissionSlugs } = payload;

  const isRoleExist = await prisma.role.findUnique({
    where: {
      roleName,
    },
  });

  if (isRoleExist) {
    throw new Error(`Role '${roleName}' already exists!`);
  }

  const existingPermissions = await prisma.permission.findMany({
    where: {
      slug: {
        in: permissionSlugs,
      },
    },
  });

  if (existingPermissions.length !== permissionSlugs.length) {
    throw new Error("One or more permissions provided are invalid!");
  }

  const newRole = await prisma.role.create({
    data: {
      roleName,
      description,

      permissions: {
        create: existingPermissions.map((permission) => ({
          permission: {
            connect: {
              id: permission.id,
            },
          },
        })),
      },
    },

    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  return newRole;
};



const getAllRoles = async (userId: string) => {
  // Check logged-in user exists
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error(
      "User not found. Please login first!"
    );
  }

  const roles = await prisma.role.findMany({
    include: {
      _count: {
        select: {
          users: true,
          permissions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return roles;
};

// 🔹 ৩. Get Single Role
const getSingleRole = async (id: string) => {
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, name: true, email: true, status: true },
      },
      permissions: {
        include: { permission: true },
      },
    },
  });

  if (!role) throw new Error("Role not found!");
  return role;
};

const updateRole = async (id: string, payload: {
  roleName?: string;
  description?: string;
  permissionSlugs?: string[];
}) => {
  const { roleName, description, permissionSlugs } = payload;

  const existingRole = await prisma.role.findUnique({ where: { id } });
  if (!existingRole) throw new Error("Role not found!");

  const protectedRoles = ['SUPER_ADMIN', 'CUSTOMER'];
  if (protectedRoles.includes(existingRole.roleName)) {
    throw new Error(`System core role '${existingRole.roleName}' cannot be modified!`);
  }

  // Name Unique Check
  if (roleName && roleName !== existingRole.roleName) {
    const isNameTaken = await prisma.role.findUnique({ where: { roleName } });
    if (isNameTaken) throw new Error(`Role name '${roleName}' is already taken!`);
  }

  let updateData: any = { roleName, description };

  if (permissionSlugs && permissionSlugs.length > 0) {
    const existingPermissions = await prisma.permission.findMany({
      where: { slug: { in: permissionSlugs } },
    });

    if (existingPermissions.length !== permissionSlugs.length) {
      throw new Error("One or more permissions provided are invalid!");
    }

    updateData.permissions = {
      deleteMany: {}, // Delete old relations in pivot table
      create: existingPermissions.map((permission) => ({
        permission: { connect: { id: permission.id } },
      })),
    };
  }

  const updatedRole = await prisma.role.update({
    where: { id },
    data: updateData,
    include: {
      permissions: { include: { permission: true } },
    },
  });

  return updatedRole;
};

const deleteRole = async (id: string) => {
  const existingRole = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } }
  });

  if (!existingRole) throw new Error("Role not found!");

  const protectedRoles = ['SUPER_ADMIN'];
  if (protectedRoles.includes(existingRole.roleName)) {
    throw new Error(`System core role '${existingRole.roleName}' cannot be deleted!`);
  }

  if (existingRole._count.users > 0) {
    throw new Error(`Cannot delete this role! ${existingRole._count.users} user(s) are currently assigned to it. Please reassign them first.`);
  }

  const deletedRole = await prisma.role.delete({
    where: { id },
  });

  return deletedRole;
};

export const roleService = {
  createRoleWithPermissions,
  getAllRoles,
  getSingleRole,
  updateRole,
  deleteRole,
};
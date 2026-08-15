import { prisma } from "../../lib/prisma";


const checkRoleModificationAccess = async (roleId: string) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new Error( "Role not found!");
  
  if (role.roleName === "SUPER_ADMIN") {
    throw new Error( "Modifying the SUPER_ADMIN core role is strictly prohibited!");
  }
  return role;
};

const assignPermissionsToRole = async (
  roleId: string,
  permissionIds: string[]
) => {
    await checkRoleModificationAccess(roleId);
  // Check role exists
  const role = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
  });

  if (!role) {
    throw new Error(
      "Role not found!"
    );
  }

  // Check permissions exist
  const permissions = await prisma.permission.findMany({
    where: {
      id: {
        in: permissionIds,
      },
    },
  });

  if (permissions.length !== permissionIds.length) {
    throw new Error(
      "One or more permissions not found!"
    );
  }

  // Assign permissions
  const result = await prisma.rolePermission.createMany({
    data: permissionIds.map((permissionId) => ({
      roleId,
      permissionId,
    })),
    skipDuplicates: true,
  });

  return result;
};





const updatePermissionsForRole = async (roleId: string, permissionIds: string[]) => {
  await checkRoleModificationAccess(roleId);

  const permissions = await prisma.permission.findMany({
    where: { id: { in: permissionIds } },
  });

  if (permissions.length !== permissionIds.length) {
    throw new Error( "One or more permissions not found!");
  }

  // Transaction use
  const result = await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId } });
    
    return await tx.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({ roleId, permissionId })),
    });
  });

  return result;
};

// 🔹 ৩. Remove Permissions 
const removePermissionsFromRole = async (roleId: string, permissionIds: string[]) => {
  await checkRoleModificationAccess(roleId);

  const result = await prisma.rolePermission.deleteMany({
    where: {
      roleId,
      permissionId: { in: permissionIds },
    },
  });

  return result;
};

const getPermissionsByRoleId = async (roleId: string) => {
  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });

  if (!role) throw new Error( "Role not found!");
  return role;
};

export const rolePermissionService={
    assignPermissionsToRole,
    updatePermissionsForRole,
    removePermissionsFromRole,
    getPermissionsByRoleId
}
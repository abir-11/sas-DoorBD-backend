import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";

export const requirePermission = (...requiredPermissions: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
 
    const userId = req.user?.id;

    if (!userId) {
      throw new Error(
        "You are not authenticated!"
      );
    }


    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: {
          select: {
            roleName: true, 
            permissions: {
              select: {
                permission: {
                  select: { slug: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error( "Authenticated user not found!");
    }

    if (!user.role) {
      throw new Error( "You do not have any role assigned!");
    }


    if (user.role.roleName === "SUPER_ADMIN") {
      return next();
    }

    const userPermissions = user.role.permissions.map(
      (item) => item.permission.slug
    );


    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new Error(

        "Forbidden! You do not have sufficient permission to access this resource."
      );
    }


    next();
  });
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { jwtUtils } from '../utils/jwt';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name: string;
                roleId: string;
                roleName: string;
                permissions: string[];
            };
        }
    }
}

/**
 * Dynamic Authentication and Authorization Middleware
 * @param requiredPermissions 
 */
export const auth = (...requiredPermissions: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies?.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer")
                ? req.headers.authorization?.split(" ")[1]
                : req.headers.authorization;

        if (!token) {
            throw new Error('Unauthorized! Token missing. Please log in.');
        }

        // 2. Verify Token
        const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifyToken.success) {
            throw new Error(verifyToken.error || 'Invalid or expired token.');
        }

        const { id } = verifyToken.data as JwtPayload;

        // 3. Fetch User with Role & Permissions
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                role: {
                    include: {
                        permissions: true,
                    },
                },
            },
        });

        if (!user) {
            throw new Error("User not found. Please log in again.");
        }

        //Status Check
        if (user.status === "BLOCKED" || user.status === "INACTIVE") {
            throw new Error("Your account has been restricted. Please contact support.");
        }

        //  Role Name 
        const isSuperAdmin = user.role.roleName === 'SUPER_ADMIN';
        const userPermissions = (user.role.permissions as Array<{ slug?: string; permission?: { slug?: string } }> | []).flatMap((permissionRecord) => {
            const slug = 'slug' in permissionRecord ? permissionRecord.slug : permissionRecord.permission?.slug;
            return slug ? [slug] : [];
        });

        //  Authorization Check Logic
        if (requiredPermissions.length > 0) {
            if (!isSuperAdmin) {
                const hasPermission = requiredPermissions.some((perm) =>
                    userPermissions.includes(perm)
                );

                if (!hasPermission) {
                    throw new Error("Forbidden. You don't have permission to access this resource.");
                }
            }
        }

        // 7. Attach to Express Request
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            roleId: user.roleId,
            roleName: user.role.roleName,
            permissions: userPermissions,
        };

        next();
    });
};
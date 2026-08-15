import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ICreateUserPayload, ICreator, IUpdateUserPayload, IUserQuery } from "./admin.interface";
import config from "../../config";
import { userCredentialsEmailTemplate } from "../../utils/email/email.template";
import { sendEmail } from "../../utils/email/sendEmail";
import { Prisma } from "../../../prisma/generated/prisma/client";
import { Gender } from './../../../prisma/generated/prisma/enums';



const createUserByAdmin = async (
    payload: ICreateUserPayload,
    creator: ICreator,
) => {
    const {
        name,
        email,
        password,
        phoneNumber,
        gender,
        roleName,
    } = payload;

    console.log("CREATOR:", creator);
    console.log("CREATOR ROLE:", creator.roleName);

    const role = creator.roleName || (creator as any)?.role?.roleName;

    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        throw new Error("Only ADMIN or SUPER_ADMIN can create users!");
    }

    // ২. নতুন ইউজারের ইমেইলটি আগে থেকেই ডাটাবেসে আছে কিনা চেক করুন
    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (isUserExist) {
        throw new Error("User already exists!");
    }

    const targetRole = await prisma.role.findUnique({
        where: {
            roleName,
        },
    });

    if (!targetRole) {
        throw new Error(
            `Role '${roleName}' not found. Please create the role first.`,
        );
    }

    const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds),
    );

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            roleId: targetRole.id,

            profiles: {
                create: {
                    gender,
                },
            },
        },

        omit: {
            password: true,
        },

        include: {
            role: {
                include: {
                    permissions: {
                        include: {
                            permission: true,
                        },
                    },
                },
            },
        },
    });

    const emailHtml = userCredentialsEmailTemplate({
        name,
        email,
        password,
        role: targetRole.roleName,
    });

    await sendEmail({
        to: email,
        subject: "Your SAS DoorBD Account Credentials",
        html: emailHtml,
    });

    return newUser;
};

const getAllUsers = async (query: IUserQuery) => {
    const {
        searchTerm,
        role,
        status,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    // Pagination
    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
        Math.max(Number(limit) || 10, 1),
        100
    );

    const skip = (pageNumber - 1) * limitNumber;

    // Where conditions
    const andConditions: Prisma.UserWhereInput[] = [];

    // Search by name, email or phone
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
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    phoneNumber: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    // Filter by role
    if (role) {
        andConditions.push({
            role: role as any,
        });
    }

    // Filter by status
    if (status) {
        andConditions.push({
            status: status as any,
        });
    }

    const whereConditions: Prisma.UserWhereInput =
        andConditions.length > 0
            ? {
                AND: andConditions,
            }
            : {};

    // Sorting
    const allowedSortFields = [
        "createdAt",
        "updatedAt",
        "name",
        "email",
    ];

    const safeSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const safeSortOrder =
        sortOrder === "asc" ? "asc" : "desc";

    const orderBy = {
        [safeSortBy]: safeSortOrder,
    } as Prisma.UserOrderByWithRelationInput;

    // Get data + total count together
    const [users, total] = await prisma.$transaction([
        prisma.user.findMany({
            where: whereConditions,

            omit: {
                password: true,
            },

            include: {
                role: true,
                profiles: true,
            },

            orderBy,

            skip,
            take: limitNumber,
        }),

        prisma.user.count({
            where: whereConditions,
        }),
    ]);

    const totalPage = Math.ceil(total / limitNumber);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage,
        },
        data: users,
    };
};

const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
        omit: { password: true },
        include: {
            role: true,
            profiles: true,
        },
    });

    if (!user) {
        throw new Error("User not found!");
    }

    return user;
};

const updateUser = async (id: string, payload: IUpdateUserPayload) => {
    const { gender, roleName, ...userData } = payload;
    const profileGender = gender ? (gender as Gender) : undefined;

    const isUserExist = await prisma.user.findUnique({ where: { id } });
    if (!isUserExist) {
        throw new Error("User not found!");
    }

    if (userData.email && userData.email !== isUserExist.email) {
        const isEmailTaken = await prisma.user.findUnique({ where: { email: userData.email } });
        if (isEmailTaken) {
            throw new Error("This email is already in use by another user!");
        }
    }

    let roleId = isUserExist.roleId;
    if (roleName) {
        const targetRole = await prisma.role.findUnique({ where: { roleName } });
        if (!targetRole) {
            throw new Error(`Role '${roleName}' not found.`);
        }
        roleId = targetRole.id;
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: {
            ...userData,
            roleId,
            ...(profileGender && {
                profiles: {
                    updateMany: {
                        where: {},
                        data: { gender: profileGender },
                    },
                },
            }),
        },
        omit: { password: true },
        include: { role: true, profiles: true },
    });

    return updatedUser;
};

const deleteUser = async (id: string, creatorId: string) => {
    const user = await prisma.user.findUnique({ where: { id }, include: { role: true } });

    if (!user) {
        throw new Error("User not found!");
    }

    if (user.id === creatorId) {
        throw new Error("You cannot delete your own account!");
    }

    if (user.role.roleName === "SUPER_ADMIN") {
        throw new Error("You cannot delete a SUPER_ADMIN account.");
    }

    const deletedUser = await prisma.user.delete({
        where: { id },
        omit: { password: true },
    });

    return deletedUser;
};

export const adminService = {
    createUserByAdmin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}
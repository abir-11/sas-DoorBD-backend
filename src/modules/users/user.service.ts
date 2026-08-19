import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma';
import config from '../../config';
import { IUpdateProfile, IUser } from './user.interface';
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const createUserDB = async (payload: IUser) => {
  const {
    name,
    email,
    password,
    phoneNumber,
  } = payload;

  if (email) {
    const isUserExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isUserExist) {
      throw new Error("User already exists with this email!");
    }
  }

  let customerRole = await prisma.role.findUnique({
    where: {
      roleName: "CUSTOMER",
    },
  });

  if (!customerRole) {
    customerRole = await prisma.role.create({
      data: {
        roleName: "CUSTOMER",
        description: "Default role for registered public users",
      },
    });
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      roleId: customerRole.id,
    },

    omit: {
      password: true,
    },

    include: {
      profile: true,
      role: true,
    },
  });

  return createdUser;
};

const getMeDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found!");
  }

  return user;
};

const updateProfileDB = async (
  userId: string,
  payload: IUpdateProfile,
  file?: Express.Multer.File,
) => {
  let profilePhoto: string | undefined;

  // Upload new profile photo
  if (file) {
    const uploadedImage = await uploadToCloudinary(
      file.buffer,
      "sas-door/profile",
    );

    profilePhoto = uploadedImage.secure_url;
  }

  // Check existing profile
  const existingProfile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  // If profile doesn't exist
  if (!existingProfile) {
    const profile = await prisma.profile.create({
      data: {
        userId,
        bio: payload.bio,
        address: payload.address,
        gender: payload.gender,
        profilePhoto,
      },
    });

    return profile;
  }

  // If profile already exists
  const updatedProfile = await prisma.profile.update({
    where: {
      userId,
    },

    data: {
      ...(payload.bio !== undefined && {
        bio: payload.bio,
      }),

      ...(payload.address !== undefined && {
        address: payload.address,
      }),

      ...(payload.gender !== undefined && {
        gender: payload.gender,
      }),

      ...(profilePhoto && {
        profilePhoto,
      }),
    },
  });

  return updatedProfile;
};


export const userService = {
  createUserDB,
  getMeDB,
  updateProfileDB
 
}
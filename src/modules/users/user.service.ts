import bcrypt from 'bcrypt';
import {  IUser } from './user.interface';
import { prisma } from '../../lib/prisma';
import config from '../../config';

const createUserDB = async (payload: IUser) => {
  const { name, email, password, profilePhoto, phoneNumber, gender } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User already exists with this email!");
  }

  let customerRole = await prisma.role.findUnique({
    where: { roleName: 'CUSTOMER' },
  });

  if (!customerRole) {
    customerRole = await prisma.role.create({
      data: {
        roleName: 'CUSTOMER',
        description: 'Default role for registered public users',
      },
    });
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      roleId: customerRole.id,
      profiles: {
        create: {
          profilePhoto,
          gender,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profiles: true,
      role: true,
    },
  });

  return createdUser;
};


export const userService = {
  createUserDB,
 
}
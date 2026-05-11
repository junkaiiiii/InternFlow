// src/types/user.ts
import { type User } from "@prisma/client";

// full user from DB
export type TUser = User;

export type TCreateUser = Pick<User, "username" | "password">;

export type TUpdateUser = Partial<TCreateUser>;

export type TPublicUser = Omit<User, "password">;
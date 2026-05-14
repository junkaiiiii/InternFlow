// src/types/user.ts
import type{ User, Board, Column, Application, Event } from "@prisma/client";

// full user from DB
export type TUser = User;

export type TCreateUser = Pick<User, "username" | "password">;

export type TUpdateUser = Partial<TCreateUser>;

export type TPublicUser = Omit<User, "password">;

export type TBoard = Board;

export type TBoardDetailed = TBoard & {columns: TColumnDetailed[]}

export type TColumn = Column;

export type TColumnDetailed = Column & {applications: Application[]}

export type TApplication = Application;

export type TEvent = Event

export type TEventReturn = {
    id: number;
    title: string;
    start: Date;
    end: Date;
    applicationId: number;
}

export type TEventWithApplication = TEvent & {application:Pick<TApplication, "company"|"role">}
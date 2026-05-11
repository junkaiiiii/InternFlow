export type TApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string;
};

export type TJWTResponse = {
    token: string
}

export type TUser = {
    id: number;
    username: string;
    email: string;
    registered_at: string;
    password: string;
}


export type TCreateUser = Pick<TUser, "username" | "password">;

export type TUpdateUser = Partial<TCreateUser>;

export type TPublicUser = Omit<TUser, "password">;

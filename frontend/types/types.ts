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

export enum AppicationPriority {
    high = "high", medium = "medium", low = "low"
}

export type TBoard = {
    id: number
    userId: number
    user: TUser
    columns: TColumn[]
}

export type TColumn = {
    id: number
    boardId: number
    board: TBoard
    name: string
    order: number
    color?: string | null
    applications: TApplication[]
}

export type TApplication = {
    id: number
    columnId: number
    column: TColumn
    company: string
    role: string
    order: number
    priority: AppicationPriority
    skills: String[]
    appliedAt?: Date | null
    createdAt: Date
}
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

export type TBoardDetailed = TBoard & { columns: TColumnDetailed[] }


export type TColumn = {
    id: number
    boardId: number
    board: TBoard
    name: string
    order: number
    color?: string | null
    applications: TApplication[]
}

export type TColumnDetailed = TColumn & { applications: TApplication[] }


export type TApplication = {
    id: number
    columnId: number
    column: TColumn
    company: string
    role: string
    order: number
    priority: AppicationPriority
    skills?: string[]
    url: string
    appliedAt?: Date | string | null
    createdAt: Date | string
}


export type TApplicationCreation = Omit<
    TApplication,
    "id" | "column" | "createdAt"
>

export type TApplicationUpdate = Omit<
    TApplication,
    "column" | "createdAt"
>
export type TEventServer = {
    id: number
    title: string;
    start: string;
    duration: number;
    applicationId: number;
}

export type TEventCalendar = {
    id: number;
    title: string;
    start: string;
    end: string;
    applicationId: number;
}

export type TEventCreation = {
    title: string
    start: string    //  just string first for the sake of date input
    duration: number
    applicationId: number
}

export type TPipelineStage = {
    stage: string;
    count: number;
    percentage: number;
}

export type TTopSkill = {
    skill: string;
    count: number;
}

export type TAnalyticsResponse = {
    pipelineData: TPipelineStage[];
    topSkills: TTopSkill[];
}
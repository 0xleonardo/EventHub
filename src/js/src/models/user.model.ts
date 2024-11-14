export enum Authority {
    USER = "ROLE_USER",
    ORGANIZER = "ROLE_ORGANIZER",
    ADMIN = "ROLE_ADMIN",
}

export interface User {
    id: string;
    username: string;
    email: string;
    authority: Authority;
    firstName?: string;
    lastName?: string;
    about?: string;
    imageUrl?: string;
    createdAt: Date;
}
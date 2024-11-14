export interface Organizer {
    id: string;
    username: string;
    email: string;
    about: string;
}

export interface Ticket {
    event_id: string;
    category: string;
    price: number;
    amount: number;
}

export interface Location {
    id: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export enum AppEventStatus {
    TEMPLATE = 'TEMPLATE',
    ACTIVE = 'ACTIVE',
    ENDED = 'ENDED'
}

export interface AppEvent {
    id: string;
    name: string;
    description: string;
    image: string;
    datetimeFrom: Date;
    datetimeTo: Date;
    organizer: Organizer;
    eventType: string;
    tickets: Ticket[];
    location: Location;
    status: AppEventStatus;
    createdAt: Date;
}

export interface AppEventType {
    id: string;
    name: string;
    image: string;
}

export interface TicketTransaction {
    eventId?: string;
    category?: string;
    numberOfTickets?: number;
    totalPaid?: number;
}

export enum TicketStatus {
    FREE = 'FREE',
    SOLD = 'SOLD',
    USED = 'USED',
    EXPIRED = 'EXPIRED'
}

export interface UserTicket {
    id: string;
    category: string;
    price: number;
    status: TicketStatus;
}

export interface UserUpdateRequest {
    firstName: string;
    lastName: string;
    about: string;
    imageUrl: string;
    email: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface EventException {
    statusCode: number;
    message: string;
}

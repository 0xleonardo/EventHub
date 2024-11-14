import agent from "../stores/agent";
import {ResponseError} from "superagent";
import {AppEventStatus, AppEventType, TicketTransaction, UserUpdateRequest} from "../models/models";
import countriesAgent from "./countries-api";
import {AppEventCreateRequest} from "../components/Pages/CreateEvent/create-event.component";
import {AppEventUpdateRequest} from "../components/Pages/UpdateEvent/update-event.component";
import {RegisterRequest} from "../components/LoginRegistration/Register/register.component";

export const getEvents = (searchQuery?: string, category?: string, countryName?: string, from?: string, to?: string, page?: number, size?: number, allEvents?: boolean, status?: string) => {
    return agent.Events.getEvents(searchQuery, category, countryName, from, to, page, size, allEvents, status)
        .catch((err: ResponseError) => {
            throw err;
        });
}

export const getEventsByPriority = (page?: number, size?: number) => {
    return agent.Events.getEventsByPriority(page, size)
        .catch((err: ResponseError) => {
            throw err;
        });
}

export const getMostSoldEvents = (page?: number, size?: number) => {
    return agent.Events.getMostSoldEvents(page, size)
        .catch((err: ResponseError) => {
            throw err;
        });
}

export const getEventTypes = (page?: number, size?: number) => {
    return agent.Events.getEventTypes(page, size)
        .catch((err: ResponseError) => {
            throw err;
        });
}

export const getEventById = (eventId: string) => {
    return agent.Events.getEventById(eventId);
}

export const makeTransaction = (ticketTransaction: TicketTransaction) => {
    return agent.Transaction.makeTransaction(ticketTransaction);
}

export const getAllTransactions = (searchQuery?: string, status?: string, page?: number, size?: number) => {
    return agent.Transaction.getAllTransactions(searchQuery, status, page, size);
}


export const getUserEvents = (page: number, size: number) => {
    return agent.Events.getUserEvents(page, size);
}

export const getOrganizerEvents = (searchQuery?: string, status?: string, page?: number, size?: number) => {
    return agent.Events.getOrganizerEvents(searchQuery, status, page, size);
}

export const createNewEvent = (appEventRequest: AppEventCreateRequest, status: AppEventStatus) => {
    return agent.Events.createNewEvent(appEventRequest, status);
}

export const updateEvent = (appEventRequest: AppEventUpdateRequest) => {
    return agent.Events.updateEvent(appEventRequest);
}

export const updateOrCreateEventType = (eventType: AppEventType) => {
    return agent.Events.updateOrCreateEventType(eventType);
}

export const publishEvent = (eventId: string) => {
    return agent.Events.publishEvent(eventId);
}

export const deleteEventType = (eventTypeId: number) => {
    return agent.Events.deleteEventType(eventTypeId);
}

export const deleteEvent = (eventTypeId: string) => {
    return agent.Events.deleteEvent(eventTypeId);
}

export const getUserEventTickets = (eventId: string) => {
    return agent.Ticket.getUserEventTickets(eventId);
}

export const updateUser = (userUpdateRequest: UserUpdateRequest) => {
    return agent.User.update(userUpdateRequest);
}

export const getOrganizerProfile = (username: string) => {
    return agent.User.getOrganizerProfile(username);
}

export const getCountries = () => {
    return countriesAgent.Countries.getAll()
        .catch((err: ResponseError) => {
            throw err;
        });
}

export const registerUser = (request: RegisterRequest) => {
    return agent.Auth.register(request);
}


export const downloadPdf = (ticketId: string) => {
    return agent.Pdf.downloadPdf(ticketId);
}

export const getAdminDashboardStatistics = () => {
    return agent.Statistics.getAdminDashboardStatistics();
}

export const getEventStatistics = (eventId: string) => {
    return agent.Statistics.getEventStatistics(eventId);
}

export const getAllUsers = (searchQuery?: string, authority?: string, page?: number, size?: number) => {
    return agent.User.getAllUsers(searchQuery, authority, page, size);
}

export const promoteToOrganizer = (userId: string) => {
    return agent.User.promoteToOrganizer(userId);
}



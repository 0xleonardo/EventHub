import superagentPromise from 'superagent-promise';
import _superagent, {Request, Response, ResponseError} from 'superagent';
import commonStore from "./common.store";
import authStore from "./auth.store";
import {AppEventStatus, AppEventType, TicketTransaction, UserUpdateRequest} from "../models/models";
import {AppEventCreateRequest} from "../components/Pages/CreateEvent/create-event.component";
import {AppEventUpdateRequest} from "../components/Pages/UpdateEvent/update-event.component";
import {RegisterRequest} from '../components/LoginRegistration/Register/register.component';
import {formatDateToDateTime} from "../utils/simple.utils";

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:8080/api';

const handleErrors = (err: ResponseError) => {
    if (err && err.response && err.response.status === 401) {
        authStore.logout();
    }
    return err;
};

const responseBody = (res: Response) => res.body;

const tokenPlugin = (req: Request) => {
    if (commonStore.token) {
        req.set('Authorization', `Bearer ${commonStore.token}`);
    }
};

const requests = {
    del: (url: string) =>
        superagent
            .del(`${API_ROOT}${url}`)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    get: (url: string) =>
        superagent
            .get(`${API_ROOT}${url}`)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    download: (url: string) =>
        superagent
            .get(`${API_ROOT}${url}`)
            .responseType('blob')
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    put: (url: string, body: any) =>
        superagent
            .put(`${API_ROOT}${url}`, body)
            .use(tokenPlugin)
            .end(handleErrors)
            .then(responseBody),
    post: (url: string, body: any) =>
        superagent
            .post(`${API_ROOT}${url}`, body)
            .use(tokenPlugin)
            .end(handleErrors),
};

const Auth = {
    current: () =>
        requests.get('/user/current'),
    login: (username: string, password: string) =>
        requests.post('/login', {
            username: username,
            password: password
        }).then(responseBody) as Promise<{ token: string }>,
    register: (request: RegisterRequest) =>
        requests.post('/register', {...request}),
};

const User = {
    update: (userUpdateRequest: UserUpdateRequest) =>
        requests.post('/user/update', {...userUpdateRequest}),
    getOrganizerProfile: (username: string) =>
        requests.post('/user', {username: username}).then(responseBody),
    getAllUsers: (searchQuery?: string, authority?: string, page?: number, size?: number) => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('searchQuery', searchQuery);
        if (authority) params.append('authority', authority);
        if (page) params.append('page', page.toString());
        if (size) params.append('size', size.toString());

        return requests.get(`/users?${params.toString()}`)
    },
    promoteToOrganizer: (userId: string) => requests.post("/user-to-organizer", {id: userId}),
};

const Events = {
    getEvents: (searchQuery?: string, category?: string, countryName?: string, from?: string, to?: string, page?: number, size?: number, allEvents?: boolean, status?: string) => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('searchQuery', searchQuery);
        if (category) params.append('category', category);
        if (countryName) params.append('countryName', countryName);
        if (from) params.append('from', formatDateToDateTime(from));
        if (to) params.append('to', formatDateToDateTime(to));
        if (page) params.append('page', page.toString());
        if (size) params.append('size', size.toString());
        if (allEvents) params.append('allEvents', allEvents.toString());
        if (status) params.append('status', status);

        return requests.get(`/events?${params.toString()}`);
    },
    getEventsByPriority: (page?: number, size?: number) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (size) params.append('size', size.toString());

        return requests.get(`/events/priority?${params.toString()}`);
    },
    getMostSoldEvents: (page?: number, size?: number) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (size) params.append('size', size.toString());

        return requests.get(`/events/most-sold?${params.toString()}`);
    },
    getEventTypes: (page?: number, size?: number) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (size) params.append('size', size.toString());

        return requests.get(`/event-types?${params.toString()}`)
    },
    getEventById: (eventId: string) =>
        requests.post('/event', {eventId: eventId}),
    getUserEvents: (page: number, size: number) =>
        requests.get(`/user/events?page=${page}&size=${size}`),
    getOrganizerEvents: (searchQuery?: string, status?: string, page?: number, size?: number) => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('searchQuery', searchQuery);
        if (status) params.append('status', status);
        if (page) params.append('page', page.toString());
        if (size) params.append('size', size.toString())

        return requests.get(`/organizer/events?${params.toString()}`)
    },
    createNewEvent: (appEventRequest: AppEventCreateRequest, status: AppEventStatus) =>
        requests.post("/event/create", {...appEventRequest, status: status}),
    updateEvent: (appEventRequest: AppEventUpdateRequest) =>
        requests.post("/event/update", {...appEventRequest}),
    publishEvent: (id: string) =>
        requests.post("/event/publish", {id: id}),
    updateOrCreateEventType: (eventType: AppEventType) =>
        requests.post("/event-type/update-or-create", {...eventType}),
    deleteEventType: (id: number) =>
        requests.post("/event-type/delete", {id: id}),
    deleteEvent: (id: string) =>
        requests.post("/event/delete", {id: id}),
};

const Transaction = {
    makeTransaction: (ticketTransaction: TicketTransaction) =>
        requests.post('/transaction', {...ticketTransaction}),
    getAllTransactions: (searchQuery?: string, status?: string, page?: number, size?: number) => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('searchQuery', searchQuery);
        if (status) params.append('status', status);
        if (page) params.append('page', page.toString());
        if (size) params.append('size', size.toString())

        return requests.get(`/transactions/all?${params.toString()}`);
    },
};

const Ticket = {
    getUserEventTickets: (eventId: string) =>
        requests.get(`/user/tickets?eventId=${eventId}`),
};

const Pdf = {
    downloadPdf: (ticketId: string) =>
        requests.download(`/download-pdf/${ticketId}`),
};

const Statistics = {
    getAdminDashboardStatistics: () =>
        requests.get("/statistics/basic"),
    getEventStatistics: (eventId: string) =>
        requests.get(`/event/statistics/${eventId}`),
};

const agent = {
    Auth,
    Events,
    Transaction,
    Ticket,
    User,
    Pdf,
    Statistics
};

export default agent;

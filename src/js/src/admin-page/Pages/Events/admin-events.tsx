import React, {useContext, useEffect, useState} from 'react';
import "./style.css"
import {AppEvent, AppEventStatus, AppEventType} from "../../../models/models";
import {deleteEvent, getCountries, getEvents, getEventTypes} from "../../../utils/api.utils";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from '@mui/material';
import ToastContext from "../../../components-styled/Toast/toast.context";
import {formatDateToDateTimeNormal} from "../../../utils/simple.utils";
import {useNavigate} from "react-router-dom";
import {MessageType} from "../../../components-styled/Toast/toast.model";
import {ResponseError} from "superagent";

interface Page<T> {
    content: T[];
    totalPages: number;
}

const _ = require("lodash")

export const AdminEvents = () => {
    const navigate = useNavigate();
    const showToast = useContext(ToastContext);
    const [countries, setCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [countryName, setCountryName] = useState('');
    const [status, setStatus] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [events, setEvents] = useState<Page<AppEvent>>({
        content: [],
        totalPages: 0,
    });
    const [eventTypes, setEventTypes] = useState<Page<AppEventType>>()

    const fetchEvents = () => {
        getEvents(searchQuery, category, countryName, from, to, page, size, true, status)
            .then((res: Page<AppEvent>) => {
                setEvents(res)
            })
    }

    useEffect(() => {
        getCountries().then((res: any) => {
            const countriesFromApi = res.map((country: any) => _.get(country, "name.common"));
            setCountries(countriesFromApi);
        })
    }, []);

    useEffect(() => {
        getEvents(searchQuery, category, countryName, from, to, page, size, true, status).then((res: Page<AppEvent>) => {
            setEvents(res)
        })
    }, [page, size]);

    useEffect(() => {
        getEventTypes().then((res: Page<AppEventType>) => {
            setEventTypes(res)
        })
    }, []);

    const handleSubmitSearch = () => {
        fetchEvents();
    }

    const handleLocationCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {value} = e.target;
        setCountryName(value)
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {value} = e.target;
        setCategory(value)
    };


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteEvent = (eventId: string) => {
        deleteEvent(eventId)
            .then((res: Response) => {
                if (res.status === 200) {
                    showToast({message: `Event deleted`, type: MessageType.SUCCESS})
                    fetchEvents();
                }
            }).catch((ex: ResponseError) => {
            showToast({message: `Something went wrong: ${ex.message}`, type: MessageType.FAILURE})
        })
    }

    return (
        <div className="admin-events">
            <div className="admin-events-heading">
                <h1>Manage Events</h1>
                <div>
                    <button className="styledGreenButton" onClick={() => navigate("/create")}>NEW</button>
                </div>
            </div>
            <div className="search-section">
                <div>
                    <label>Search</label>
                    <input type="text" placeholder="Search by name, state or city"
                           onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
                <div>
                    <label>Category</label>
                    <select name="category"
                            value={category}
                            onChange={handleCategoryChange}>
                        <option value="" disabled={true}>Select category</option>
                        <option value="">No select</option>
                        {eventTypes?.content.map((eventType, index) => (
                            <option key={index} value={eventType.name}>
                                {eventType.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Country</label>
                    <select name="country"
                            value={countryName}
                            onChange={handleLocationCountryChange}>
                        <option value="" disabled={true}>Select country</option>
                        <option value="">No select</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Event Status</label>
                    <select name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}>
                        <option value="" disabled={true}>Select status</option>
                        <option value="">No select</option>
                        {Object.values(AppEventStatus).map((type, index) => (
                            <option value={type} key={index}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Select date range</label>
                    <div>
                        <input type="date" onChange={(e) => setFrom(e.target.value)}/>
                        <input type="date" onChange={(e) => setTo(e.target.value)}/>
                    </div>
                </div>
                <button className="styledRedButton search-button" onClick={handleSubmitSearch}><i
                    className="fa-solid fa-magnifying-glass"/></button>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>EventType</TableCell>
                            <TableCell>Date From</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Created At</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events && events?.content.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row" sx={{width: "160px"}}>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell><img src={row.image} alt={row.name} style={{width: '120px'}}/></TableCell>
                                <TableCell>{row.eventType}</TableCell>
                                <TableCell>{formatDateToDateTimeNormal(row.datetimeFrom)}</TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>{formatDateToDateTimeNormal(row.createdAt)}</TableCell>
                                <TableCell style={{width: '160px'}}>
                                    <div style={{display: "flex", flexDirection: "column", gap: "6px"}}>
                                        <button className="styledGreenButton"
                                                onClick={() => navigate(`/event/${row.id}`)}>
                                            <i className="fa-solid fa-eye"/> SHOW
                                        </button>
                                        {row.status !== AppEventStatus.ENDED && <button className="styledBlueButton"
                                                                                        onClick={() => navigate(`/update/${row.id}`)}>
                                            <i className="fa-solid fa-pen-to-square"/> EDIT
                                        </button>}
                                        {row.status !== AppEventStatus.ACTIVE &&
                                            <button className="styledRedButton"
                                                    onClick={() => handleDeleteEvent(row.id)}><i
                                                className="fa-solid fa-trash"/> DELETE
                                            </button>}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                count={events.totalPages * size}
                                rowsPerPage={size}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
};
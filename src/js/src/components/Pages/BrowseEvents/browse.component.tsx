import React, {useEffect, useState} from 'react';
import "./style.css"
import {AppEvent, AppEventType} from "../../../models/models";
import {getCountries, getEvents, getEventTypes} from "../../../utils/api.utils";
import {EventCard} from "../../Event/Event-card/event-card.component";
import {useNavigate} from "react-router-dom";
import {sortStringAlphabetically} from "../../../utils/simple.utils";

const _ = require("lodash");


interface Page<T> {
    content: T[];
    totalPages: number;
}

export const EventBrowser = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);

    const [countries, setCountries] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState(params.get('category') || '');
    const [countryName, setCountryName] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [page, setPage] = useState(0);
    const [size] = useState(6);
    const [events, setEvents] = useState<Page<AppEvent>>({
        content: [],
        totalPages: 0,
    });
    const [eventTypes, setEventTypes] = useState<Page<AppEventType>>()

    useEffect(() => {
        getCountries().then((res: any) => {
            const countriesFromApi = res.map((country: any) => _.get(country, "name.common")).sort(sortStringAlphabetically);
            setCountries(countriesFromApi);
        })
    }, []);

    useEffect(() => {
        getEvents(searchQuery, category, countryName, from, to, page, size).then((res: Page<AppEvent>) => {
            setEvents(res)
        })
    }, [category, page, size]);

    useEffect(() => {
        getEventTypes().then((res: Page<AppEventType>) => {
            setEventTypes(res)
        })
    }, []);

    const handleSubmitSearch = () => {
        getEvents(searchQuery, category, countryName, from, to, page, size)
            .then((res: Page<AppEvent>) => {
                setEvents(res)
            })
    }

    const handleLocationCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {value} = e.target;
        setCountryName(value)
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {value} = e.target;
        setCategory(value)
    };

    return (
        <div className="browse">
            <div className="section-one">
                <div className="heading">
                    Browse Events
                </div>
            </div>
            <div className="browse-container">
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
                        <label>Select date range</label>
                        <div>
                            <input type="date" onChange={(e) => setFrom(e.target.value)}/>
                            <input type="date" onChange={(e) => setTo(e.target.value)}/>
                        </div>
                    </div>
                    <button className="styledRedButton search-button" onClick={handleSubmitSearch}><i
                        className="fa-solid fa-magnifying-glass"/></button>
                </div>
                <div className="event-list">
                    {events.content.map((event, index) => (
                        <EventCard key={index} event={event} onClick={() => navigate(`/event/${event.id}`)}/>
                    ))}
                </div>
                {events && events.content.length !== 0 ? <>
                        <div className="pagination-buttons">
                            <button onClick={() => setPage(page - 1)} disabled={page === 0}
                                    className="styledRedButton">Previous
                            </button>
                            <button onClick={() => setPage(page + 1)} disabled={page >= events.totalPages - 1}
                                    className="styledBlueButton">Next
                            </button>
                        </div>
                    </> :
                    <>
                        <div className="sorry-message">Unfortunately no events match your search</div>
                    </>}
            </div>
        </div>
    );
};

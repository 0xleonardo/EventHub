import React, {useContext, useEffect, useState} from "react";
import "./style.css"
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageUploader from "../../../components-styled/ImageUploader/image-uploader.component";
import {getCountries, getEventById, getEventTypes, updateEvent} from "../../../utils/api.utils";
import {AppEventType, EventException} from "../../../models/models";
import ToastContext from "../../../components-styled/Toast/toast.context";
import {Response, ResponseError} from "superagent";
import {useNavigate, useParams} from "react-router-dom";
import {MessageType} from "../../../components-styled/Toast/toast.model";
import {inputStyles} from "../../../components-styled/input-styles";
import {sortStringAlphabetically} from "../../../utils/simple.utils";

const _ = require('lodash');
const moment = require('moment');

interface Ticket {
    category: string;
    price: number;
    amount: number;
    amountToAdd: number;
    readonly?: string;
}

interface Location {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}

export interface AppEventUpdateRequest {
    id: string;
    name: string;
    description: string;
    image: string;
    datetimeFrom: string;
    datetimeTo: string;
    eventType: string;
    tickets: Ticket[];
    location: Location;
}

interface LocationErrors {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
}

interface TicketErrors {
    category?: string;
    price?: string;
    amount?: string;
    amountToAdd?: string;
}

type Errors = {
    name?: string;
    description?: string;
    image?: string;
    datetimeFrom?: string;
    datetimeTo?: string;
    eventType?: string;
    location?: LocationErrors;
    tickets?: TicketErrors[];
};

interface Page<T> {
    content: T[];
    totalPages: number;
}

export function UpdateEvent() {
    const minDateTime = moment().format('YYYY-MM-DDTHH:mm');
    const {eventId} = useParams();
    const showToast = useContext(ToastContext)
    const navigate = useNavigate();
    const [countries, setCountries] = useState([]);
    const [eventTypes, setEventTypes] = useState<Page<AppEventType>>();
    const [appEvent, setAppEvent] = useState<AppEventUpdateRequest>({
        id: "",
        name: "",
        description: "",
        image: "",
        datetimeFrom: "",
        datetimeTo: "",
        eventType: "",
        tickets: [],
        location: {
            address: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
        },
    });

    useEffect(() => {
        getEventById(eventId!)
            .then((res: Response) => {
                if (res.status === 200) {
                    const appEvent = res.body;

                    if (moment(appEvent.datetimeFrom) < moment()) {
                        throw Error("You can't update events that are finished");
                    }

                    const updatedTickets = appEvent.tickets.map((ticket: Ticket) => ({
                        ...ticket,
                        amountToAdd: 0,
                        readonly: true
                    }));
                    setAppEvent({...appEvent, tickets: updatedTickets});
                }
            }).catch((res: any) => {
            showToast({message: res.message, type: MessageType.FAILURE})
            navigate("/")
        })
    }, []);

    const [errors, setErrors] = useState<Errors>({});

    const [step, setStep] = useState(0);

    useEffect(() => {
        getCountries().then((res: any) => {
            const countriesFromApi = res.map((country: any) => _.get(country, "name.common")).sort(sortStringAlphabetically);
            setCountries(countriesFromApi);
        })
    }, []);

    useEffect(() => {
        getEventTypes().then((res: Page<AppEventType>) => {
            setEventTypes(res)
        })
    }, []);

    const handleNextStep = () => {
        if (validate()) setStep(step + 1);
    };

    const handlePreviousStep = () => {
        setStep(step - 1);
    };

    const validate = () => {
        let validationErrors: Errors = {};

        if (!appEvent.name.trim()) validationErrors.name = "Name is required";
        if (!appEvent.description.trim()) validationErrors.description = "Description is required";
        if (!appEvent.image.trim()) validationErrors.image = "Image is required";
        if (!appEvent.datetimeFrom.trim()) validationErrors.datetimeFrom = "Start date is required";
        if (!appEvent.datetimeTo.trim()) validationErrors.datetimeTo = "End date is required";
        if (!appEvent.eventType.trim()) validationErrors.eventType = "Event type is required";

        const fromDate = moment(appEvent.datetimeFrom);
        const toDate = moment(appEvent.datetimeTo);

        if (fromDate.isAfter(toDate)) {
            validationErrors.datetimeFrom = "Start date must be before end date";
        }

        if (!appEvent.image.trim()) validationErrors.image = "Image is required";

        if (step === 1) {
            let ticketErrors: TicketErrors[] = [];
            appEvent.tickets.forEach((ticket, index) => {
                let ticketError: TicketErrors = {};
                if (!ticket.category.trim()) ticketError.category = "Category is required";
                if (ticket.price < 0 || ticket.price > 10000) ticketError.price = "Price must be between 0 and 10000";
                if (!ticket.readonly && (ticket.amount < 0 || ticket.amount > 10000)) ticketError.amount = "Amount must be between 0 and 10000";
                if (ticket.amountToAdd < 0 || ticket.amountToAdd > 10000) ticketError.amountToAdd = "Amount must be between 0 and 10000";
                if (Object.keys(ticketError).length > 0) {
                    ticketErrors[index] = ticketError;
                }
            });
            if (ticketErrors.length > 0) validationErrors.tickets = ticketErrors;
        }

        let locationErrors: LocationErrors = {};
        if (step === 2) {
            if (!appEvent.location.address.trim()) locationErrors.address = "Address is required";
            if (!appEvent.location.city.trim()) locationErrors.city = "City is required";
            if (!appEvent.location.state.trim()) locationErrors.state = "State is required";
            if (!appEvent.location.country.trim()) locationErrors.country = "Country is required";
            if (!appEvent.location.zipCode.trim()) locationErrors.zipCode = "Zip Code is required";

            if (Object.keys(locationErrors).length > 0) {
                validationErrors.location = locationErrors;
            }
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setAppEvent((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setAppEvent((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value,
            },
        }));
    };

    const handleLocationCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setAppEvent((prev) => ({
            ...prev,
            location: {...prev.location, [name]: value},
        }));
    };

    const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {value} = e.target;
        setAppEvent((prev) => ({
            ...prev,
            eventType: value,
        }));
    };


    const handleAddTicket = () => {
        setAppEvent((prev) => ({
            ...prev,
            tickets: [...prev.tickets, {category: "", price: 0, amount: 0, amountToAdd: 0}],
        }));
    };

    const handleTicketChange = (index: number, field: keyof Ticket, value: string) => {
        setAppEvent((prev) => ({
            ...prev,
            tickets: prev.tickets.map((ticket, i) =>
                i === index ? {...ticket, [field]: value} : ticket
            ),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            updateEvent(appEvent)
                .then((res: Response) => {
                    if (res.status === 200) {
                        showToast({message: "Event successfully updated", type: MessageType.SUCCESS})
                        navigate(`/event/${appEvent.id}`)
                    }
                }).catch((ex: ResponseError) => {
                try {
                    const exception = JSON.parse(ex.message) as EventException;
                    showToast({
                        message: `There was an error while updating event: ${exception.message}`,
                        type: MessageType.FAILURE
                    })
                } catch (err: any) {
                    showToast({
                        message: `There was an error while updating event: Unexpected error`,
                        type: MessageType.FAILURE
                    })
                }
            })
        }
    };

    const handleRemoveTicket = (index: number) => {
        setAppEvent((prev) => ({
            ...prev,
            tickets: prev.tickets.filter((_, i) => i !== index),
        }));
    };

    const handleDescriptionChange = (event: any, editor: any) => {
        const data = editor.getData();
        setAppEvent((prev) => ({...prev, description: data}));
    };

    const getStepText = () => {
        switch (step) {
            case 0:
                return 'Event Details';
            case 1:
                return 'Tickets';
            case 2:
                return 'Location';
            default:
                return 'step';
        }
    }

    const handleImageUpload = (url: string) => {
        setAppEvent((prev) => ({...prev, image: url}));
    };

    return (
        <div className="create-event">
            <div className="info">
                <div className="info-section">
                    <div className="heading">Create Event</div>
                    <div className="step">
                        {getStepText()}
                    </div>
                </div>
            </div>
            <div className="create-event-container">
                <form onSubmit={handleSubmit}>
                    {step === 0 && <div>
                        <div className="create-event-step-one">
                            <div>
                                <label>Name</label>
                                <input type="text" name="name" value={appEvent.name} onChange={handleInputChange}
                                       style={errors.name ? inputStyles.input_error : inputStyles.input}/>
                                {errors.name && <div style={inputStyles.error}>{errors.name}</div>}
                            </div>
                            <div>
                                <label>Event Category</label>
                                <select
                                    name="event-type"
                                    value={appEvent.eventType}
                                    placeholder="Select type"
                                    onChange={handleEventTypeChange}
                                    style={errors.eventType ? inputStyles.input_error : inputStyles.input}
                                >
                                    {eventTypes && eventTypes.content.map((type, index) => (
                                        <option key={index} value={type.name}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.eventType && <div style={inputStyles.error}>{errors.eventType}</div>}
                            </div>
                            <div>
                                <label>Description</label>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={appEvent.description}
                                    onChange={handleDescriptionChange}
                                />
                                {errors.description && <div style={inputStyles.error}>{errors.description}</div>}
                            </div>
                            <div>
                                <label>Image</label>
                                <ImageUploader image={appEvent.image} onUpload={handleImageUpload}/>
                            </div>
                            <div className="dates">
                                <div>
                                    <label>Start</label>
                                    <input type="datetime-local" name="datetimeFrom" value={appEvent.datetimeFrom}
                                           onChange={handleInputChange}
                                           style={errors.datetimeFrom ? inputStyles.input_error : inputStyles.input}
                                           min={minDateTime}/>
                                    {errors.datetimeFrom && <div style={inputStyles.error}>{errors.datetimeFrom}</div>}
                                </div>
                                <div>
                                    <label>End</label>
                                    <input type="datetime-local" name="datetimeTo" value={appEvent.datetimeTo}
                                           onChange={handleInputChange}
                                           style={errors.datetimeTo ? inputStyles.input_error : inputStyles.input}
                                           min={minDateTime}/>
                                    {errors.datetimeTo && <div style={inputStyles.error}>{errors.datetimeTo}</div>}
                                </div>
                            </div>
                        </div>
                        <div className="buttons">
                            <button onClick={handleNextStep} className="styledBlueButton">Next</button>
                        </div>
                    </div>}

                    {step === 1 &&
                        <div className="create-event-step-two">
                            <h3>New Tickets:</h3>
                            <div className="event-ticket-list">
                                {errors.tickets && errors.tickets.length === 1 && errors.tickets[0]?.amount === "At least one ticket must be provided" && (
                                    <div style={inputStyles.error}>{errors.tickets[0]?.amount}</div>
                                )}
                                {appEvent.tickets.map((ticket, index) => (
                                    <div key={index} className="event-ticket">
                                        {!ticket.readonly &&
                                            <button type="button" onClick={() => handleRemoveTicket(index)}
                                                    className="styledRedButton">x
                                            </button>}
                                        <div>
                                            <label>Category</label>
                                            {ticket.readonly ? <div>{ticket.category}</div> : <>
                                                <input type="text" value={ticket.category}
                                                       onChange={(e) => handleTicketChange(index, "category", e.target.value)}
                                                       style={errors.tickets && errors.tickets[index]?.category ? inputStyles.input_error : inputStyles.input}/>
                                                {errors.tickets && errors.tickets[index]?.category && (
                                                    <div
                                                        style={inputStyles.error}>{errors.tickets[index]?.category}</div>)}
                                            </>}
                                        </div>
                                        <div>
                                            <label>Price (€)</label>
                                            {ticket.readonly ? <div>{ticket.price}</div> : <>
                                                <input type="number" value={ticket.price}
                                                       onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                                                       style={errors.tickets && errors.tickets[index]?.price ? inputStyles.input_error : inputStyles.input}/>
                                                {errors.tickets && errors.tickets[index]?.price && (
                                                    <div
                                                        style={inputStyles.error}>{errors.tickets[index]?.price}</div>)}
                                            </>}
                                        </div>
                                        {ticket.readonly && <div>
                                            <label>Amount Left</label>
                                            <div>{ticket.amount}</div>
                                        </div>}
                                        <div>
                                            <label>Amount To Add</label>
                                            <input type="number" value={ticket.amountToAdd}
                                                   onChange={(e) => handleTicketChange(index, "amountToAdd", e.target.value)}
                                                   style={errors.tickets && errors.tickets[index]?.amount ? inputStyles.input_error : inputStyles.input}/>
                                            {errors.tickets && errors.tickets[index]?.amountToAdd && (
                                                <div
                                                    style={inputStyles.error}>{errors.tickets[index]?.amountToAdd}</div>)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="buttons">
                                <button type="button" onClick={handleAddTicket}
                                        className="styledBlueButton">
                                    Add Ticket
                                </button>
                                <div>
                                    <button onClick={handlePreviousStep} className="styledRedButton">Back</button>
                                    <button onClick={handleNextStep} className="styledBlueButton">Next</button>
                                </div>
                            </div>
                        </div>}

                    {step === 2 && <div>
                        <h3>Location:</h3>
                        <div style={{marginBottom: "20px"}}>
                            <div>
                                <label>Address</label>
                                <input type="text" name="address" value={appEvent.location.address}
                                       onChange={handleLocationChange}
                                       style={errors.location && errors.location.address ? inputStyles.input_error : inputStyles.input}/>
                                {errors.location?.address &&
                                    <div style={inputStyles.error}>{errors.location.address}</div>}
                            </div>
                            <div>
                                <label>City</label>
                                <input type="text" name="city" value={appEvent.location.city}
                                       onChange={handleLocationChange}
                                       style={errors.location && errors.location.city ? inputStyles.input_error : inputStyles.input}/>
                                {errors.location?.city && <div style={inputStyles.error}>{errors.location.city}</div>}
                            </div>
                            <div>
                                <label>State</label>
                                <input type="text" name="state" value={appEvent.location.state}
                                       onChange={handleLocationChange}
                                       style={errors.location && errors.location.state ? inputStyles.input_error : inputStyles.input}/>
                                {errors.location?.state && <div style={inputStyles.error}>{errors.location.state}</div>}
                            </div>
                            <div>
                                <label>Country</label>
                                <select
                                    name="country"
                                    value={appEvent.location.country}
                                    onChange={handleLocationCountryChange}
                                    style={errors.location && errors.location.country ? inputStyles.input_error : inputStyles.input}
                                >
                                    {countries.map((country, index) => (
                                        <option key={index} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                                {errors.location?.country &&
                                    <div style={inputStyles.error}>{errors.location.country}</div>}
                            </div>
                            <div>
                                <label>Zip Code</label>
                                <input type="text" name="zipCode" value={appEvent.location.zipCode}
                                       onChange={handleLocationChange}
                                       style={errors.location && errors.location.zipCode ? inputStyles.input_error : inputStyles.input}/>
                                {errors.location?.zipCode &&
                                    <div style={inputStyles.error}>{errors.location.zipCode}</div>}
                            </div>
                        </div>
                        <button onClick={handlePreviousStep} className="styledRedButton">Back</button>
                        <button type="submit" className="styledGreenButton">Update Event</button>
                    </div>}
                </form>
            </div>
        </div>
    );
}

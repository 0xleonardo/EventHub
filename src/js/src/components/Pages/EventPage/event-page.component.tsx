import "./style.css"
import "./ticket-modal.css"
import "../../../components-styled/CSS/ck-editor.css"
import {useNavigate, useParams} from "react-router-dom";
import {observer} from "mobx-react";
import React, {useContext, useEffect, useState} from "react";
import {AppEvent, AppEventStatus, Ticket, TicketTransaction} from "../../../models/models";
import {getEventById, makeTransaction} from "../../../utils/api.utils";
import {Response, ResponseError} from "superagent";
import {Loading} from "../../../routes/routes";
import {formatDateTime, hasUndefinedFields} from "../../../utils/simple.utils";
import {TicketSection} from "./TicketSection/ticket-section.component";
import ToastContext from "../../../components-styled/Toast/toast.context";
import Modal from "./TicketModal/modal.component";
import NumberInputForm from "../../../components-styled/Inputs/number-input.component";
import {MessageType} from "../../../components-styled/Toast/toast.model";
import {useStore} from "../../../stores/store-provider";

export const EventPage = observer(() => {
    const {userStore} = useStore();
    const {eventId} = useParams();
    const showToast = useContext(ToastContext);
    const navigate = useNavigate();

    const [numberOfTickets, setNumberOfTickets] = React.useState<string>('0');
    const [isValidUrl, setIsValidUrl] = useState(false);
    const [event, setEvent] = useState<AppEvent>({} as AppEvent);
    const [showModal, setShowModal] = useState(false);
    const [modalTicket, setModalTicket] = useState<Ticket>();
    const [modalError, setModalError] = useState<string | undefined>();
    const [ticketTransaction, setTicketTransaction] = useState<TicketTransaction>({
        eventId: undefined,
        category: undefined,
        numberOfTickets: undefined,
        totalPaid: undefined
    })

    const isEventFinished = event.status === AppEventStatus.ENDED;

    useEffect(() => {
        getEventById(eventId!)
            .then((res: Response) => {
                if (res.status === 200) {
                    setIsValidUrl(true);
                    if (res.body.status === AppEventStatus.TEMPLATE && res.body.organizer.id !== userStore.getUser?.id) {
                        navigate("/not-found")
                    }
                    setEvent(res.body);
                }
            })
    }, []);

    const calculateTotalPrice = (numberOfTickets: number) => {
        const ticketsPrice = numberOfTickets * modalTicket!.price;
        const totalPrice = ticketsPrice * 1.05;
        setTicketTransaction({...ticketTransaction, totalPaid: totalPrice, numberOfTickets: numberOfTickets})
    }

    const handleOnTicketBuy = (ticket: Ticket) => {
        setModalTicket(ticket)
        setShowModal(true);
        setTicketTransaction({
            ...ticketTransaction,
            eventId: event.id,
            category: ticket.category,
            totalPaid: undefined,
            numberOfTickets: undefined
        })
    }

    const handleNumberOfTicketsChange = (numberOfTickets: number | undefined) => {
        if (numberOfTickets) {
            setNumberOfTickets(numberOfTickets.toString())
            calculateTotalPrice(numberOfTickets)
        } else {
            setTicketTransaction({...ticketTransaction, totalPaid: undefined, numberOfTickets: undefined})
        }
    }

    const hasModalError = (error: string | undefined) => {
        setModalError(error)
    }

    const closeModal = () => {
        setNumberOfTickets('0')
        setShowModal(false)
    }

    const handleConfirmBuyTickets = () => {
        makeTransaction(ticketTransaction).then((res: Response) => {
            if (res.status === 200) {
                closeModal()
                showToast({message: `You successfully bought tickets for ${event.name}`, type: MessageType.SUCCESS})
                navigate("/")
            }
        }).catch((err: ResponseError) => {
            showToast({
                message: `Oh no! Something went wrong. We couldn't reserve tickets for ${event.name}`,
                type: MessageType.FAILURE
            })
            console.log(err.message);
        })
    }

    if (!isValidUrl) {
        return <Loading/>
    }

    return (
        <div className="event-page-wrapper">
            <Modal show={showModal} onClose={closeModal}>
                <div className="modal-info">
                    <span className="brand-name">Event<span>Hub</span></span>
                    <hr/>
                    <div className="event-to-book">
                        <div>Booking: <span>{event.name}</span></div>
                    </div>
                    <hr/>
                    <div className="ticket-buy-info">
                        <div>
                            <div>Ticket Type:</div>
                            <span>{modalTicket?.category}</span>
                        </div>
                        <div>
                            <div>Number of Tickets:</div>
                            <NumberInputForm value={numberOfTickets}
                                             max={modalTicket?.amount}
                                             errorMessage="Sorry, but we don't have that much tickets at stock"
                                             onValueChange={handleNumberOfTicketsChange}
                                             hasError={hasModalError}/>
                        </div>
                        <div>
                            <div>Ticket Price:</div>
                            <span>{ticketTransaction.numberOfTickets ? ticketTransaction.numberOfTickets * modalTicket!.price : 0} €</span>
                        </div>
                        <div>
                            <div>Total Price (EventHub tax 5%):</div>
                            <span>{ticketTransaction.totalPaid ? ticketTransaction.totalPaid : 0} €</span>
                        </div>
                        {modalError && <div style={{color: 'red', fontSize: "12px"}}>{modalError}</div>}
                    </div>
                    <div className="modal-buttons">
                        <button onClick={closeModal}
                                className="styledRedButton">CANCEL
                        </button>
                        <button disabled={hasUndefinedFields(ticketTransaction) || !!modalError}
                                onClick={handleConfirmBuyTickets}
                                className="styledBlueButton">Confirm
                        </button>
                    </div>
                </div>
            </Modal>
            <div className="event-page-section-one" style={{backgroundImage: `url(${event.image})`}}>
                <div className="section-container">
                    <span className="name">{event.name}</span>
                    {!isEventFinished ? <span className="message"><i className="fa-solid fa-location-dot"/>
                        {` ${event.location.city} | ${event.location.address}`}
                    </span> : <span className="sorry-message">Unfortunately event has finished</span>}
                </div>
            </div>

            <div className="event-page-section-two">
                <div className="section-container-one">
                    <div className="event-info-one">
                        <div className="event-main">
                            <div className="event-name">{event.name}</div>
                            <div className="event-organizer">Event by: <a
                                onClick={() => navigate(`/user/${event.organizer.username}`)}>{event.organizer.username}</a>
                            </div>
                        </div>
                        <div className="event-labels">
                            <div className="blue">{event.eventType}</div>
                            {isEventFinished && <div className="red">FINISHED</div>}
                        </div>
                        <div className="event-description">
                            <pre className="ck-content" dangerouslySetInnerHTML={{__html: event.description}}/>
                        </div>
                    </div>
                    <div className="event-info-two">
                        <div>
                            <div className="event-info-where">
                                <div className="event-info-where-heading">
                                    <i className="fa-solid fa-map"/>
                                    <span>WHERE</span>
                                </div>
                                <div>
                                    <div>{`${event.location.country}, ${event.location.address}`}</div>
                                    <div>{`${event.location.city}, ${event.location.zipCode}`}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="event-info-when">
                                <div className="event-info-when-heading">
                                    <i className="fa-regular fa-clock"/>
                                    <span>WHEN</span>
                                </div>
                                <div>
                                    <div>{formatDateTime(event.datetimeFrom)}</div>
                                    <div>Till</div>
                                    <div>{formatDateTime(event.datetimeTo)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!isEventFinished && <div className="section-container-two">
                    <div>
                        <div className="section-container-two-heading">Get your Tickets</div>
                        {!userStore.isUserLoggedIn &&
                            <div className="section-container-two-subheading">You must be Signed In to buy
                                tickets</div>}
                    </div>
                    <div className="section-container-two-tickets">
                        {event.tickets.length > 0 ?
                            <TicketSection tickets={event.tickets} handleBuyTickets={handleOnTicketBuy}/> :
                            <div className="sorry-message">Unfortunately, all tickets for this event are sold</div>}
                    </div>
                </div>}
            </div>
        </div>
    );
})
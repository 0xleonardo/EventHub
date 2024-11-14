import {observer} from "mobx-react";
import React, {useContext, useEffect, useState} from "react";
import "./style.css"
import {getEventStatistics} from "../../../utils/api.utils";
import {ResponseError} from "superagent";
import ToastContext from "../../../components-styled/Toast/toast.context";
import {MessageType} from "../../../components-styled/Toast/toast.model";
import {useNavigate, useParams} from "react-router-dom";
import {AppEvent} from "../../../models/models";

interface TicketStat {
    category: string;
    overallTickets: number;
    ticketPrice: number;
    ticketsSold: number;
}

interface RevenueStat {
    expectedMaxRevenue: number;
    revenueFromSoldTickets: number;
}

export interface EventStatistics {
    ticketStats: TicketStat[];
    revenueStats: RevenueStat;
    event: AppEvent;
}


export const EventStatisticsComponent = observer(() => {
    const navigate = useNavigate();
    const {eventId} = useParams();
    const showToast = useContext(ToastContext);
    const [eventStatistics, setEventStatistics] = useState<EventStatistics>();

    useEffect(() => {
        getEventStatistics(eventId!)
            .then((res: EventStatistics) => {
                setEventStatistics(res)
            }).catch((ex: ResponseError) => {
            showToast({message: "Couldn't fetch statistics", type: MessageType.FAILURE})
        })
    }, [])

    return (
        <div className="event-statistics">
            <div className="event-statistics-heading">
                <h1>Event Statistics</h1>
            </div>
            <div className="event-statistics-content">
                <div className="event-statistics-info">
                    <h1>{eventStatistics?.event.name}</h1>
                    <h1>{eventStatistics?.event.id}</h1>
                </div>
                <div className="event-statistics-statistics">
                    <div className="event-statistics-statistics-section">
                        <div className="icon"><i className="fa-solid fa-money-check-dollar"/></div>
                        <div className="info">
                            <div>Sold Tickets Revenue</div>
                            <span>{eventStatistics?.revenueStats.revenueFromSoldTickets} €</span>
                        </div>
                        <div className="info">
                            <div>Expected Max Revenue</div>
                            <span>{eventStatistics?.revenueStats.expectedMaxRevenue} €</span>
                        </div>
                        <div className="info"/>
                        <div className="info"/>
                        <div className="info"/>
                    </div>
                    {eventStatistics?.ticketStats.map((ticketStat) => (
                        <div className="event-statistics-statistics-section">
                            <div className="icon"><i className="fa-solid fa-ticket"/></div>
                            <div className="info">Ticket Category <span>{ticketStat.category}</span></div>
                            <div className="info">Ticket Price <span>{ticketStat.ticketPrice} €</span></div>
                            <div className="info">Ticket Count <span>{ticketStat.overallTickets}</span></div>
                            <div className="info">Tickets Sold <span>{ticketStat.ticketsSold}</span></div>
                            <div className="info">Max/Current
                                Revenue: <span>{ticketStat.overallTickets * ticketStat.ticketPrice}€ / {ticketStat.ticketsSold * ticketStat.ticketPrice} €</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
})
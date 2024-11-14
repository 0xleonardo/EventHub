import "./style.css";
import {observer} from "mobx-react";
import {AppEvent, AppEventStatus} from "../../../models/models";
import {formatDate} from "../../../utils/simple.utils";

interface EventCardProps {
    event: AppEvent;
    onClick: () => void;
    isTemplate?: boolean;
}

export const EventCard = observer((props: EventCardProps) => {
    const {isTemplate} = props;
    const filter = props.event.status === AppEventStatus.ENDED ? "grayscale(100%)" : undefined;

    return (
        <div className="event-card-overlay" onClick={props.onClick}>
            <div className="event-card-image"
                 style={{backgroundImage: `url("${props.event.image}")`, filter: filter}}/>
            <div className="event-card-description">
                <div className="event-card-date"
                     style={{filter: filter}}>{formatDate(props.event.datetimeFrom)}</div>
                <div className="event-card-name">{props.event.name}</div>
                <div
                    className="event-card-address">{`${props.event.location.city} | ${props.event.location.address}`}</div>
                <div className="event-card-type"
                     style={{filter: filter}}>{isTemplate ? "TEMPLATE" : props.event.eventType}</div>
            </div>
        </div>
    )
});
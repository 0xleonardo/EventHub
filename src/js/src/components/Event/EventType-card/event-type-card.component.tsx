import "./style.css";
import {observer} from "mobx-react";
import {AppEventType} from "../../../models/models";
import {useNavigate} from "react-router-dom";

interface EventTypeCardProps {
    eventType: AppEventType;
}

export const EventTypeCard = observer((props: EventTypeCardProps) => {
    const navigate = useNavigate();

    return (
        <div className="eventtype-card-overlay" onClick={() => navigate(`/browse?category=${props.eventType.name}`)}>
            <div className="eventtype-card-image" style={{backgroundImage: `url("${props.eventType.image}")`}}/>
            <div className="eventtype-card-name">{props.eventType.name}</div>
        </div>
    )
});
import {observer} from "mobx-react";
import "./style.css";
import React, {useEffect, useState} from "react";
import {AppEvent} from "../../../models/models";
import {EventCard} from "../../Event/Event-card/event-card.component";
import {useNavigate, useParams} from "react-router-dom";
import {getOrganizerProfile} from "../../../utils/api.utils";
import {ResponseError} from "superagent";

interface Page<T> {
    content: T[];
    totalPages: number;
}

export interface PublicOrganizerProfileResponse {
    id: string;
    username: string;
    email: string;
    imageUrl: string;
    about: string;
    events: AppEvent[];
}

export const PublicOrganizerProfileComponent = observer(() => {
    const {username} = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState<PublicOrganizerProfileResponse>();
    const [events, setEvents] = useState<AppEvent[]>([]);

    useEffect(() => {
        getOrganizerProfile(username!)
            .then((res: PublicOrganizerProfileResponse) => {
                setUser(res)
                setEvents(res.events)
            }).catch((res: ResponseError) => {
            navigate("/not-found")
        })
    }, [])


    return (
        <div className="public-organizer-profile-page">
            <div className="section-one" style={{backgroundImage: `url(${user?.imageUrl})`}}>
                <div className="heading">
                    <div><span style={{color: "#D61600"}}>{user?.username}</span> Profile</div>
                </div>
            </div>
            <div className="section-two">
                <div className="contact-mail"><i className="fa-regular fa-paper-plane"/> {user?.email}</div>
                <div className="about">
                    <div className="about-heading">About</div>
                    {user?.about && <pre className="ck-content" dangerouslySetInnerHTML={{__html: user.about}}/>}
                </div>
            </div>
            <div className="section-three" id="my-events">
                <div className="heading">
                    Latest Events
                </div>
                {events && events.length > 0 ?
                    <div className="events-section">
                        <div className="events">
                            {events.map((event: AppEvent, index) => (
                                <EventCard key={index} event={event} onClick={() => navigate(`/event/${event.id}`)}/>
                            ))}
                        </div>
                    </div>
                    :
                    <div className="no-events sorry-message">
                        Currently {user?.username} doesn't have any active events
                    </div>
                }
            </div>
        </div>
    )
})
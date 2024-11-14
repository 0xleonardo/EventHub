import "./style.css";
import {observer} from "mobx-react";
import {EventCard} from "../../Event/Event-card/event-card.component";
import {EventTypeCard} from "../../Event/EventType-card/event-type-card.component";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {AppEvent, AppEventType} from "../../../models/models";
import {getEventsByPriority, getEventTypes, getMostSoldEvents} from "../../../utils/api.utils";

interface Page<T> {
    content: T[];
    totalPages: number;
}

export const HomeComponent = observer(() => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<AppEvent[]>();
    const [mostSoldEvents, setMostSoldEvents] = useState<AppEvent[]>();
    const [eventTypes, setEventTypes] = useState<Page<AppEventType>>();

    useEffect(() => {
        getEventTypes(0, 3).then((res: Page<AppEventType>) => {
            setEventTypes(res)
        })

        getEventsByPriority(0, 6).then((res: Page<AppEvent>) => {
            setEvents(res.content)
        })

        getMostSoldEvents(0, 6).then((res: Page<AppEvent>) => {
            setMostSoldEvents(res.content)
        })
    }, [])

    return (
        <div className="home-wrapper">
            <div className="home-section-one">
                <div className="section-container">
                    <span className="name">Event<span>Hub</span></span>
                    <span className="message">Welcome to the future of event organization: simple, secure, spectacular. Join us and let's create extraordinary experiences together!</span>
                </div>
            </div>

            <div className="home-section-two">
                <div>
                    <div className="heading"><i className="fas fa-star"/> Featured Events <i className="fas fa-star"/>
                    </div>
                    <div className="section-container-one">
                        {events && events.length > 0 && events.map((event, index) => {
                            return <EventCard key={index} event={event} onClick={() => navigate(`/event/${event.id}`)}/>
                        })}
                    </div>
                </div>
                <div className="section-container-two">
                    <div className="section-container-heading"><i className="fa-solid fa-clipboard-list"/> Event
                        Categories <i className="fa-solid fa-clipboard-list"/></div>
                    <div className="section-container-types">
                        {eventTypes && eventTypes.content.map((eventType, index) => {
                            return <EventTypeCard key={index} eventType={eventType}/>
                        })}
                    </div>
                </div>
            </div>

            <div className="home-section-three">
                <div className="section-container">
                    <div className="message">
                        <div>How it works for</div>
                        <span>Customers</span>
                    </div>
                    <div className="steps">
                        <div>
                            <i className="fa-solid fa-calendar-days"/>
                            <span>1. Choose Event</span>
                            <div>Sign up, browse through, and pick your favorite event. Your next adventure awaits!
                            </div>
                        </div>
                        <div>
                            <i className="fa-solid fa-ticket"/>
                            <span>2. Get Tickets</span>
                            <div>Grab your tickets right from the event page and join the excitement!</div>
                        </div>
                        <div>
                            <i className="fa-solid fa-shoe-prints"/>
                            <span>3. Attend Event</span>
                            <div>Head out, enjoy the event, and let the good times roll!</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="home-section-two">
                <div>
                    <div className="heading"><i className="fa-solid fa-fire"/> Events on Fire <i
                        className="fa-solid fa-fire"/>
                    </div>
                    <div className="section-container-one">
                        {mostSoldEvents && mostSoldEvents.length > 0 && mostSoldEvents.map((event, index) => {
                            return <EventCard key={index} event={event} onClick={() => navigate(`/event/${event.id}`)}/>
                        })}
                    </div>
                </div>
            </div>

            <div className="home-section-four">
                <div className="section-container">
                    <div className="message">
                        <div>How it works for</div>
                        <span>For Event Organisers</span>
                    </div>
                    <div className="steps">
                        <div>
                            <i className="fas fa-calendar-plus"/>
                            <span>1. Create Event</span>
                            <div>Sign up, become an organizer, and begin creating your events.</div>
                        </div>
                        <div>
                            <i className="fas fa-calendar-check"/>
                            <span>2. Publish Event</span>
                            <div>Provide full details about your event and make it live.</div>
                        </div>
                        <div>
                            <i className="fas fa-money-check-alt"/>
                            <span>3. Start Selling</span>
                            <div>Start selling your event tickets and watch your profits grow.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

})
import {observer} from "mobx-react";
import {Ticket} from "../../../../models/models";
import "./style.css"
import {useStore} from "../../../../stores/store-provider";
import "../../../../components-styled/CSS/button.css"

interface TicketSectionProps {
    tickets: Ticket[]
    handleBuyTickets: (ticket: Ticket) => void;
}

export const TicketSection = observer((props: TicketSectionProps) => {
    const {userStore} = useStore();

    const {isUserLoggedIn, isUserOrganizer, isUserAdmin} = userStore;
    const {tickets} = props;

    return (
        <div className="tickets-list">
            {tickets.map((ticket, index) => {
                return (
                    <div key={index} className="ticket-row">
                        <div className="ticket-row-info">
                            <div>{ticket.category}</div>
                            <div>Available <span>{ticket.amount}</span></div>
                            <div>Price per Ticket <span>{ticket.price} €</span></div>
                        </div>
                        <div className="ticket-row-button">
                            <button className="styledBlueButton"
                                    disabled={!isUserLoggedIn || isUserOrganizer || isUserAdmin}
                                    onClick={() => props.handleBuyTickets(ticket)}>Buy Tickets
                            </button>
                        </div>
                    </div>
                )
            })}
        </div>
    );
})
package hr.tvz.dreamteam.eventhub.web.tickets;


import hr.tvz.dreamteam.eventhub.domain.Ticket;
import hr.tvz.dreamteam.eventhub.web.tickets.model.EventTicketsDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketService {

    List<EventTicketsDTO> findAllUserTicketsForEvent(UUID eventId);

    Optional<Ticket> activateTicket(UUID ticketActivateId);

}

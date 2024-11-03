package hr.tvz.dreamteam.eventhub.infrastructure.web.tickets;


import hr.tvz.dreamteam.eventhub.infrastructure.domain.Ticket;
import hr.tvz.dreamteam.eventhub.infrastructure.web.tickets.model.EventTicketsDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketService {

    List<EventTicketsDTO> findAllUserTicketsForEvent(UUID eventId);

    Optional<Ticket> activateTicket(UUID ticketActivateId);

}

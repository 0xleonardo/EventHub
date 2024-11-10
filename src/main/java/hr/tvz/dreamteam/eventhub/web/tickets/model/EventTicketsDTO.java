package hr.tvz.dreamteam.eventhub.web.tickets.model;


import hr.tvz.dreamteam.eventhub.domain.TicketStatus;

import java.util.UUID;

public record EventTicketsDTO(UUID id, String category, double price, TicketStatus status) {
}

package hr.tvz.dreamteam.eventhub.infrastructure.web.tickets.model;


import hr.tvz.dreamteam.eventhub.infrastructure.domain.TicketStatus;

import java.util.UUID;

public record EventTicketsDTO(UUID id, String category, double price, TicketStatus status) {
}

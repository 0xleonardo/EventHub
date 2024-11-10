package hr.tvz.dreamteam.eventhub.web.transactions.model;

import hr.tvz.dreamteam.eventhub.domain.TicketStatus;

import java.util.UUID;

public record TransactionTicketDTO(UUID id, String category, double price, UUID activateId, TicketStatus status) {

}

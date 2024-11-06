package hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model;

import java.util.UUID;

public record TransactionRequest(UUID eventId, String category, Integer numberOfTickets, double totalPaid) {
}

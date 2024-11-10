package hr.tvz.dreamteam.eventhub.web.transactions.model;

import java.util.UUID;

public record TransactionRequest(UUID eventId, String category, Integer numberOfTickets, double totalPaid) {
}

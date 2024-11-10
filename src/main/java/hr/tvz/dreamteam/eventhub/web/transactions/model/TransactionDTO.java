package hr.tvz.dreamteam.eventhub.web.transactions.model;

import hr.tvz.dreamteam.eventhub.domain.PaymentStatus;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

public record TransactionDTO(UUID id, PaymentStatus paymentStatus, double amountPaid, Timestamp timestamp,
                             List<TransactionTicketDTO> tickets, EventDTO event) {
}

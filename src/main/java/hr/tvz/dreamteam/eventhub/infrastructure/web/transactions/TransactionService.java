package hr.tvz.dreamteam.eventhub.infrastructure.web.transactions;

import hr.tvz.dreamteam.eventhub.infrastructure.domain.PaymentStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.Transaction;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.TransactionDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.TransactionRequest;
import org.springframework.data.domain.Page;

public interface TransactionService {

    Transaction assignTickets(TransactionRequest transactionRequest);

    Page<TransactionDTO> findAllTransactions(String searchQuery, PaymentStatus paymentStatus, int page, int size);
}

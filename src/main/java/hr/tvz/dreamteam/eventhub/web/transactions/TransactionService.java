package hr.tvz.dreamteam.eventhub.web.transactions;

import hr.tvz.dreamteam.eventhub.domain.PaymentStatus;
import hr.tvz.dreamteam.eventhub.domain.Transaction;
import hr.tvz.dreamteam.eventhub.web.transactions.model.TransactionDTO;
import hr.tvz.dreamteam.eventhub.web.transactions.model.TransactionRequest;
import org.springframework.data.domain.Page;

public interface TransactionService {

    Transaction assignTickets(TransactionRequest transactionRequest);

    Page<TransactionDTO> findAllTransactions(String searchQuery, PaymentStatus paymentStatus, int page, int size);
}

package hr.tvz.dreamteam.eventhub.web.transactions;

import hr.tvz.dreamteam.eventhub.domain.PaymentStatus;
import hr.tvz.dreamteam.eventhub.domain.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.sql.Timestamp;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    Long countAllByTimestampIsAfter(Timestamp dateTime);

    @Query("SELECT t FROM Transaction t WHERE " +
            "(:searchQuery IS NULL OR (CAST(t.id AS STRING) LIKE LOWER(CONCAT('%', :searchQuery, '%')))) " +
            "AND (:paymentStatus IS NULL OR (t.paymentStatus = :paymentStatus)) " +
            "ORDER BY t.timestamp DESC")
    Page<Transaction> findAllTransactions(String searchQuery, PaymentStatus paymentStatus, Pageable pageable);

}

package hr.tvz.dreamteam.eventhub.web.tickets;

import hr.tvz.dreamteam.eventhub.domain.Event;
import hr.tvz.dreamteam.eventhub.domain.Ticket;
import hr.tvz.dreamteam.eventhub.domain.TicketStatus;
import hr.tvz.dreamteam.eventhub.web.statictics.model.RevenueStats;
import hr.tvz.dreamteam.eventhub.web.statictics.model.TicketStats;
import hr.tvz.dreamteam.eventhub.web.tickets.model.EventTicketsDTO;
import hr.tvz.dreamteam.eventhub.web.transactions.model.TicketDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    @Query("SELECT new hr.tvz.dreamteam.eventhub.web.transactions.model.TicketDTO(t.event.id, t.category, t.price, COUNT(t)) FROM Ticket t WHERE t.event.id = :event_id AND t.status = 'FREE' GROUP BY t.event.id, t.category, t.price")
    List<TicketDTO> getAllGroupedByForEventId(UUID event_id);

    @Query("SELECT new hr.tvz.dreamteam.eventhub.web.transactions.model.TicketDTO(t.event.id, t.category, t.price, COUNT(t)) FROM Ticket t WHERE t.event.id = :event_id GROUP BY t.event.id, t.category, t.price")
    List<TicketDTO> getAllGroupedByCategory(UUID event_id);

    @Query("SELECT t FROM Ticket t WHERE t.event = :event AND t.category = :category AND t.status = :status ORDER BY t.id")
    List<Ticket> findTicketsByEventAndCategory(Event event, String category, TicketStatus status, Pageable pageable);

    @Query("SELECT new hr.tvz.dreamteam.eventhub.web.tickets.model.EventTicketsDTO(t.id, t.category, t.price, t.status) " +
            "FROM Event e " +
            "JOIN Transaction tr ON e.id = tr.event.id " +
            "JOIN Ticket t ON tr.id = t.transaction.id " +
            "WHERE tr.user.id = :userId AND e.id = :eventId " +
            "ORDER BY e.id")
    List<EventTicketsDTO> findAllUserTicketsForEvent(UUID userId, UUID eventId);

    Optional<Ticket> findTicketById(UUID ticketId);

    Optional<Ticket> findTicketByActivateId(UUID activateId);

    @Query(value = "SELECT t.category AS category, t.price AS ticketPrice, " +
            "(SELECT COUNT(*) FROM ticket WHERE event_id = t.event_id AND category = t.category) AS overallTickets, " +
            "(SELECT COUNT(*) FROM ticket WHERE event_id = t.event_id AND category = t.category AND status = 'SOLD') AS ticketsSold " +
            "FROM ticket t " +
            "WHERE t.event_id = :eventId " +
            "GROUP BY t.category, t.event_id", nativeQuery = true)
    List<TicketStats> getTicketStats(UUID eventId);

    @Query("SELECT COALESCE(SUM(tr.amountPaid), 0) AS revenueFromSoldTickets, COALESCE(SUM(tr.amountPaid), 0) + SUM(CASE WHEN t.transaction IS NULL THEN t.price ELSE 0 END) AS expectedMaxRevenue FROM Ticket t LEFT JOIN t.transaction tr WHERE t.event.id = :eventId")
    RevenueStats findEventRevenueStats(UUID eventId);
}

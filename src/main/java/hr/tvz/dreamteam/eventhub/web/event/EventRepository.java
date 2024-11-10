package hr.tvz.dreamteam.eventhub.web.event;

import hr.tvz.dreamteam.eventhub.domain.Event;
import hr.tvz.dreamteam.eventhub.domain.EventStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {

    @Query("SELECT e FROM Event e " +
            "JOIN Transaction t ON e.id = t.event.id " +
            "JOIN Ticket tk ON tk.transaction.id = t.id " +
            "WHERE e.status = :eventStatus AND tk.status = 'SOLD' " +
            "GROUP BY e.id " +
            "ORDER BY COUNT(tk.id) DESC")
    Page<Event> findEventsWithMostTicketsSold(EventStatus eventStatus, Pageable pageable);

    @Query(value = "SELECT e FROM Event e " +
            "WHERE e.status = :eventStatus " +
            "order by e.priority desc")
    Page<Event> findActiveEventsByPriority(EventStatus eventStatus, Pageable pageable);

    Optional<Event> findEventById(UUID eventId);

    Optional<Event> findEventByIdAndUser_Id(UUID eventId, UUID userId);

    @Query(value = "SELECT DISTINCT e " +
            "FROM Event e " +
            "JOIN Transaction tr ON e.id = tr.event.id " +
            "JOIN Ticket t ON tr.id = t.transaction.id " +
            "WHERE tr.user.id = :userId " +
            "ORDER BY e.datetimeFrom DESC")
    Page<Event> findEventsWithUserTickets(UUID userId, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE " +
            "(:searchQuery IS NULL OR (LOWER(e.name) LIKE LOWER(CONCAT('%', :searchQuery, '%')))) " +
            "AND (:status IS NULL OR (e.status = :status)) " +
            "AND e.user.id = :userId " +
            "ORDER BY e.datetimeFrom DESC")
    Page<Event> findAllOrganizerEvents(String searchQuery, EventStatus status, UUID userId, Pageable pageable);

    List<Event> findTop3ByUser_IdAndStatusOrderByDatetimeFrom(UUID userId, EventStatus eventStatus);

    @Query("SELECT e FROM Event e WHERE (:categoryName IS NULL OR e.eventType.name = :categoryName) " +
            "AND (:from IS NULL OR e.datetimeFrom >= :from) " +
            "AND (:to IS NULL OR e.datetimeTo <= :to) " +
            "AND (:searchQuery IS NULL OR (LOWER(e.name) LIKE LOWER(CONCAT('%', :searchQuery, '%'))" +
            "OR LOWER(e.location.city) LIKE LOWER(CONCAT('%', :searchQuery, '%')) " +
            "OR LOWER(e.location.state) LIKE LOWER(CONCAT('%', :searchQuery, '%'))))" +
            "AND (:countryName IS NULL OR LOWER(e.location.country) = LOWER(:countryName)) " +
            "AND (:status IS NULL OR (e.status = :status)) " +
            "ORDER BY e.datetimeFrom DESC")
    Page<Event> findAllEventsWithFilter(String searchQuery, String categoryName, String countryName, LocalDateTime from, LocalDateTime to, Pageable pageable, EventStatus status);

    @Query("SELECT e FROM Event e WHERE (:categoryName IS NULL OR e.eventType.name = :categoryName) " +
            "AND (:from IS NULL OR e.datetimeFrom >= :from) " +
            "AND (:to IS NULL OR e.datetimeTo <= :to) " +
            "AND (:searchQuery IS NULL OR (LOWER(e.name) LIKE LOWER(CONCAT('%', :searchQuery, '%'))" +
            "OR LOWER(e.location.city) LIKE LOWER(CONCAT('%', :searchQuery, '%')) " +
            "OR LOWER(e.location.state) LIKE LOWER(CONCAT('%', :searchQuery, '%'))))" +
            "AND (:countryName IS NULL OR LOWER(e.location.country) = LOWER(:countryName)) " +
            "AND e.datetimeFrom >= CURRENT_TIMESTAMP " +
            "AND e.status = :status " +
            "ORDER BY e.datetimeFrom DESC")
    Page<Event> findAllActiveEventsWithFilter(String searchQuery, String categoryName, String countryName, LocalDateTime from, LocalDateTime to, Pageable pageable, EventStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE Event e SET e.status = hr.tvz.dreamteam.eventhub.domain.EventStatus.ENDED WHERE e.datetimeTo < CURRENT_TIMESTAMP")
    void makePastEventEnded();

    @Modifying
    @Transactional
    @Query("UPDATE Ticket t " +
            "SET t.status = hr.tvz.dreamteam.eventhub.domain.TicketStatus.EXPIRED " +
            "WHERE t.event.id IN (" +
            "    SELECT e.id FROM Event e " +
            "    WHERE e.datetimeTo < CURRENT_TIMESTAMP)")
    void expirePastEventTickets();

    Long countAllByStatus(EventStatus status);
}



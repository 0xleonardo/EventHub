package hr.tvz.dreamteam.eventhub.infrastructure.web.event;

import hr.tvz.dreamteam.eventhub.infrastructure.domain.Event;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.create_event.CreateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.DeleteEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.PublishEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.UpdateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.DeleteEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.UpdateEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.EventDTO;
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

    @Query(value = "SELECT e FROM Event e " +
            "WHERE e.status = :eventStatus " +
            "order by e.priority desc")
    Page<Event> findActiveEventsByPriority(EventStatus eventStatus, Pageable pageable);

    Optional<Event> findEventById(UUID eventId);

    Optional<Event> findEventByIdAndUser_Id(UUID eventId, UUID userId);

    @Query(value = "SELECT DISTINCT e " +
            "FROM Event e " +
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
    @Query("UPDATE Event e SET e.status = hr.tvz.dreamteam.eventhub.infrastructure.domain.EventStatus.ENDED WHERE e.datetimeTo < CURRENT_TIMESTAMP")
    void makePastEventEnded();


    Long countAllByStatus(EventStatus status);
}

package hr.tvz.dreamteam.eventhub.infrastructure.web.event;

import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventType;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.create_event.CreateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.DeleteEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.PublishEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.UpdateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.DeleteEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.UpdateEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.EventDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface EventService {

    Page<EventDTO> getAllEvents(String searchQuery, String categoryName, String countryName, LocalDateTime from, LocalDateTime to, int page, int size, boolean allEvents, EventStatus status);

    Page<EventDTO> getAllActiveEventsByPriority(int page, int size);

    Page<EventDTO> findEventsWithMostTicketsSold(int page, int size);

    Page<EventType> getAllEventTypes(int page, int size);

    Optional<EventDTO> getEventById(UUID eventId);

    Page<EventDTO> getAllUserEvents(int page, int size);

    Page<EventDTO> getAllCurrentOrganizerEvents(String searchQuery, EventStatus status, int page, int size);

    ResponseEntity<Object> createNewEvent(CreateEventRequest eventRequest);

    ResponseEntity<Object> updateNewEvent(UpdateEventRequest eventRequest);

    ResponseEntity<Object> publishEvent(PublishEventRequest publishRequest);

    ResponseEntity<Object> updateOrCreateEventType(UpdateEventTypeRequest request);

    ResponseEntity<Object> deleteEventType(DeleteEventTypeRequest request);

    ResponseEntity<Object> deleteEvent(DeleteEventRequest request);
}

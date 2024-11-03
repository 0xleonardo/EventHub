package hr.tvz.dreamteam.eventhub.infrastructure.web.event;

import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventType;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.create_event.CreateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.DeleteEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.PublishEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.UpdateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.DeleteEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.UpdateEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.EventByIdRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.EventDTO;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("api")
@AllArgsConstructor
public class EventController {

    private EventService eventService;

    @GetMapping("/events")
    public Page<EventDTO> getAllEvents(
            @RequestParam(required = false) String searchQuery,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String countryName,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDateTime to,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "6") int size,
            @RequestParam(name = "allEvents", defaultValue = "false") boolean allEvents,
            @RequestParam(required = false, name = "status") EventStatus status) {
        return eventService.getAllEvents(searchQuery, category, countryName, from, to, page, size, allEvents, status);
    }

    @GetMapping("/events/priority")
    public Page<EventDTO> getAllEventsByPriority(@RequestParam(name = "page", defaultValue = "0") int page,
                                                 @RequestParam(name = "size", defaultValue = "6") int size) {
        return eventService.getAllActiveEventsByPriority(page, size);
    }

    @GetMapping("/events/most-sold")
    public Page<EventDTO> findEventsWithMostTicketsSold(@RequestParam(name = "page", defaultValue = "0") int page,
                                                        @RequestParam(name = "size", defaultValue = "6") int size) {
        return eventService.findEventsWithMostTicketsSold(page, size);
    }

    @PostMapping("/event")
    public ResponseEntity<EventDTO> getEventById(@RequestBody EventByIdRequest eventByIdRequest) {
        return eventService.getEventById(eventByIdRequest.eventId())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/event-types")
    public Page<EventType> getAllEventTypes(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "1000") int size) {
        return eventService.getAllEventTypes(page, size);
    }

    @GetMapping("/user/events")
    public Page<EventDTO> getAllUserEvents(@RequestParam(name = "page", defaultValue = "0") int page,
                                           @RequestParam(name = "size", defaultValue = "6") int size) {

        return eventService.getAllUserEvents(page, size);
    }

    @Secured("ROLE_ORGANIZER")
    @GetMapping("/organizer/events")
    public Page<EventDTO> getAllCurrentOrganizerEvents(@RequestParam(name = "page", defaultValue = "0") int page,
                                                       @RequestParam(name = "size", defaultValue = "6") int size,
                                                       @RequestParam(required = false) String searchQuery,
                                                       @RequestParam(required = false, name = "status") EventStatus status) {

        return eventService.getAllCurrentOrganizerEvents(searchQuery, status, page, size);
    }

    @Secured({"ROLE_ORGANIZER", "ROLE_ADMIN"})
    @PostMapping("/event/create")
    public ResponseEntity<Object> createNewEvent(@RequestBody @Valid CreateEventRequest eventRequest) {
        return eventService.createNewEvent(eventRequest);
    }

    @Secured({"ROLE_ORGANIZER", "ROLE_ADMIN"})
    @PostMapping("/event/update")
    public ResponseEntity<Object> updateEvent(@RequestBody @Valid UpdateEventRequest eventRequest) {
        return eventService.updateNewEvent(eventRequest);
    }

    @Secured({"ROLE_ORGANIZER", "ROLE_ADMIN"})
    @PostMapping("/event/publish")
    public ResponseEntity<Object> publishEvent(@RequestBody @Valid PublishEventRequest publishRequest) {
        return eventService.publishEvent(publishRequest);
    }

    @Secured({"ROLE_ADMIN"})
    @PostMapping("/event-type/update-or-create")
    public ResponseEntity<Object> updateOrCreateEventType(@RequestBody @Valid UpdateEventTypeRequest request) {
        return eventService.updateOrCreateEventType(request);
    }

    @Secured({"ROLE_ADMIN"})
    @PostMapping("/event-type/delete")
    public ResponseEntity<Object> deleteEventType(@RequestBody @Valid DeleteEventTypeRequest request) {
        return eventService.deleteEventType(request);
    }

    @Secured("ROLE_ADMIN")
    @PostMapping("/event/delete")
    public ResponseEntity<Object> deleteEvent(@RequestBody @Valid DeleteEventRequest request) {
        return eventService.deleteEvent(request);
    }

}

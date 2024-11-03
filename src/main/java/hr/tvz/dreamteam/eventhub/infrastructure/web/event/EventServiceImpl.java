package hr.tvz.dreamteam.eventhub.infrastructure.web.event;

import hr.tvz.dreamteam.eventhub.infrastructure.domain.*;
import hr.tvz.dreamteam.eventhub.infrastructure.security.SecurityUtils;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.AuthorityType;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.User;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.create_event.CreateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.DeleteEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.PublishEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event.UpdateEventRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.DeleteEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.event.update.event_type.UpdateEventTypeRequest;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.EventDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.security.user.UserRepository;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.OrganizerUserDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model.TicketDTO;
import hr.tvz.dreamteam.eventhub.infrastructure.web.tickets.TicketRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class EventServiceImpl implements EventService {

    private EventRepository eventRepository;

    private TicketRepository ticketRepository;

    private EventTypeRepository eventTypeRepository;
    private UserRepository userRepository;

    @Override
    public Page<EventDTO> getAllEvents(String searchQuery, String categoryName, String countryName, LocalDateTime from, LocalDateTime to, int page, int size, boolean allEvents, EventStatus status) {
        if (allEvents) {
            return eventRepository.findAllEventsWithFilter(searchQuery, categoryName, countryName, from, to, PageRequest.of(page, size), status).map(this::mapToEventDTO);
        }

        return eventRepository.findAllActiveEventsWithFilter(searchQuery, categoryName, countryName, from, to, PageRequest.of(page, size), EventStatus.ACTIVE).map(this::mapToEventDTO);
    }

    @Override
    public Page<EventDTO> getAllActiveEventsByPriority(int page, int size) {
        return eventRepository.findActiveEventsByPriority(EventStatus.ACTIVE, PageRequest.of(page, size)).map(this::mapToEventDTO);
    }

    @Override
    public Page<EventDTO> findEventsWithMostTicketsSold(int page, int size) {
        return eventRepository.findEventsWithMostTicketsSold(EventStatus.ACTIVE, PageRequest.of(page, size)).map(this::mapToEventDTO);
    }

    @Override
    public Page<EventType> getAllEventTypes(int page, int size) {
        return eventTypeRepository.findAll(PageRequest.of(page, size));
    }

    @Override
    public Optional<EventDTO> getEventById(UUID eventId) {
        return eventRepository.findEventById(eventId).map(this::mapToEventDTO);
    }

    @Override
    public Page<EventDTO> getAllUserEvents(int page, int size) {
        return eventRepository.findEventsWithUserTickets(getCurrentUser().getId(), PageRequest.of(page, size)).map(this::mapToEventDTO);
    }

    @Override
    public Page<EventDTO> getAllCurrentOrganizerEvents(String searchQuery, EventStatus status, int page, int size) {
        return eventRepository.findAllOrganizerEvents(searchQuery, status, getCurrentUser().getId(), PageRequest.of(page, size)).map(this::mapToEventDTO);
    }

    @Override
    public ResponseEntity<Object> createNewEvent(CreateEventRequest eventRequest) {
        try {
            var newEvent = createNewEventEntity(eventRequest);
            var savedEvent = eventRepository.save(newEvent);
            return ResponseEntity.ok().body(savedEvent.getId());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().contentType(MediaType.APPLICATION_JSON)
                    .body(ex.getMessage());
        }
    }

    @Override
    public ResponseEntity<Object> updateNewEvent(UpdateEventRequest eventRequest) {
        if (getCurrentUser().getAuthority().getAuthorityType() == AuthorityType.ROLE_ADMIN) {
            var eventToUpdate = eventRepository.findEventById(eventRequest.id());

            if (eventToUpdate.isEmpty()) {
                throw EventException.notFound("Event couldn't be found");
            }

            var newEvent = updateEvent(eventRequest, eventToUpdate.get());
            eventRepository.save(newEvent);
            return ResponseEntity.ok().build();
        } else {
            var eventToUpdate = eventRepository.findEventByIdAndUser_Id(eventRequest.id(), getCurrentUser().getId());

            if (eventToUpdate.isEmpty()) {
                throw EventException.notFound("Event couldn't be found");
            }

            var newEvent = updateEvent(eventRequest, eventToUpdate.get());
            eventRepository.save(newEvent);
            return ResponseEntity.ok().build();
        }
    }

    @Override
    public ResponseEntity<Object> publishEvent(PublishEventRequest publishRequest) {
        var eventToUpdate = eventRepository.findEventByIdAndUser_Id(publishRequest.id(), getCurrentUser().getId());

        if (eventToUpdate.isEmpty()) {
            throw EventException.notFound("Event couldn't be found");
        }

        var updatedEvent = eventToUpdate.get();

        if (updatedEvent.getStatus() == EventStatus.ENDED || updatedEvent.getStatus() == EventStatus.ACTIVE) {
            throw EventException.notFound("Event has status ENDED or ACTIVE, couldn't update it");
        }

        updatedEvent.setStatus(EventStatus.ACTIVE);
        eventRepository.save(updatedEvent);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Object> updateOrCreateEventType(UpdateEventTypeRequest request) {
        var eventTypeToUpdate = eventTypeRepository.findEventTypeById(request.id());

        if (eventTypeToUpdate.isEmpty()) {
            var newEventType = new EventType();
            newEventType.setName(request.name());
            newEventType.setImage(request.image());

            eventTypeRepository.save(newEventType);
            return ResponseEntity.ok().build();
        } else {
            var updatedEventType = eventTypeToUpdate.get();
            updatedEventType.setName(request.name());
            updatedEventType.setImage(request.image());

            eventTypeRepository.save(updatedEventType);
            return ResponseEntity.ok().build();
        }
    }

    @Override
    public ResponseEntity<Object> deleteEventType(DeleteEventTypeRequest request) {
        eventTypeRepository.deleteById(request.id());
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Object> deleteEvent(DeleteEventRequest request) {
        var event = eventRepository.findEventById(request.id());

        if (event.isEmpty()) {
            throw EventException.notOwner();
        }

        if (event.get().getStatus() == EventStatus.ACTIVE) {
            throw EventException.eventActive("Active Event can't be deleted!");
        }

        eventRepository.deleteById(request.id());
        return ResponseEntity.ok().build();
    }

    private EventDTO mapToEventDTO(Event event) {
        return new EventDTO(event.getId(), event.getName(), event.getDescription(), event.getImage(),
                event.getDatetimeFrom(), event.getDatetimeTo(), mapToOrganizerDTO(event.getUser()),
                event.getEventType().getName(), mapToTicketDTO(event.getId()), event.getLocation(), event.getStatus());
    }

    private OrganizerUserDTO mapToOrganizerDTO(User user) {
        return new OrganizerUserDTO(user.getId(), user.getUsername(), user.getEmail(), user.getAbout());
    }

    private List<TicketDTO> mapToTicketDTO(UUID eventId) {
        return ticketRepository.getAllGroupedByForEventId(eventId);
    }

    private User getCurrentUser() {
        var currentlyLoggedUser = SecurityUtils.getCurrentUserUsername();
        return userRepository.findOneByUsername(currentlyLoggedUser.get()).get();
    }

    private Event createNewEventEntity(CreateEventRequest eventRequest) {
        var newEvent = new Event();
        var currentUser = getCurrentUser();
        newEvent.setName(eventRequest.name());
        newEvent.setDescription(eventRequest.description());
        var eventType = eventTypeRepository.findEventTypeByName(eventRequest.eventType());
        newEvent.setEventType(eventType);
        newEvent.setDatetimeFrom(eventRequest.datetimeFrom());
        newEvent.setDatetimeTo(eventRequest.datetimeTo());
        newEvent.setImage(eventRequest.image());

        newEvent.setUser(currentUser);
        newEvent.setPriority(1);

        var newLocation = new Location();
        newLocation.setAddress(eventRequest.location().address());
        newLocation.setCity(eventRequest.location().city());
        newLocation.setCountry(eventRequest.location().country());
        newLocation.setState(eventRequest.location().state());
        newLocation.setZipCode(eventRequest.location().zipCode());
        newEvent.setLocation(newLocation);

        newEvent.setStatus(eventRequest.status());

        return newEvent;
    }

    private Event updateEvent(UpdateEventRequest eventRequest, Event event) {
        event.setName(eventRequest.name());
        event.setDescription(eventRequest.description());
        var eventType = eventTypeRepository.findEventTypeByName(eventRequest.eventType());
        event.setEventType(eventType);
        event.setDatetimeFrom(eventRequest.datetimeFrom());
        event.setDatetimeTo(eventRequest.datetimeTo());
        event.setImage(eventRequest.image());

        var newLocation = event.getLocation();
        newLocation.setAddress(eventRequest.location().address());
        newLocation.setCity(eventRequest.location().city());
        newLocation.setCountry(eventRequest.location().country());
        newLocation.setState(eventRequest.location().state());
        newLocation.setZipCode(eventRequest.location().zipCode());
        event.setLocation(newLocation);

        return event;
    }
}

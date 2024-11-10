package hr.tvz.dreamteam.eventhub.web.transactions.model;

import hr.tvz.dreamteam.eventhub.domain.EventStatus;
import hr.tvz.dreamteam.eventhub.domain.Location;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record EventDTO(UUID id, String name, String description,
                       String image,
                       LocalDateTime datetimeFrom, LocalDateTime datetimeTo,
                       OrganizerUserDTO organizer, String eventType,
                       List<TicketDTO> tickets, Location location, EventStatus status) {
}


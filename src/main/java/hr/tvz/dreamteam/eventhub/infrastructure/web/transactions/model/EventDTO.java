package hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model;

import hr.tvz.dreamteam.eventhub.infrastructure.domain.EventStatus;
import hr.tvz.dreamteam.eventhub.infrastructure.domain.Location;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record EventDTO(UUID id, String name, String description,
                       String image,
                       LocalDateTime datetimeFrom, LocalDateTime datetimeTo,
                       String eventType, Location location, EventStatus status) {
}

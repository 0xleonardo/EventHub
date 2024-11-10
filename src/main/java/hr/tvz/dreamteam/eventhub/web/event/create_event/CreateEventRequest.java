package hr.tvz.dreamteam.eventhub.web.event.create_event;

import hr.tvz.dreamteam.eventhub.domain.EventStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record CreateEventRequest(@NotNull String name,
                                 @NotNull String description,
                                 @NotNull String eventType,
                                 @NotNull String image,
                                 @NotNull LocalDateTime datetimeFrom,
                                 @NotNull LocalDateTime datetimeTo,
                                 @NotEmpty List<CreateTicketRequest> tickets,
                                 @NotNull CreateLocationRequest location,
                                 @NotNull EventStatus status) {
}

package hr.tvz.dreamteam.eventhub.web.event.update.event;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record UpdateEventRequest(@NotNull UUID id,
                                 @NotNull String name,
                                 @NotNull String description,
                                 @NotNull String eventType,
                                 @NotNull String image,
                                 @NotNull LocalDateTime datetimeFrom,
                                 @NotNull LocalDateTime datetimeTo,
                                 @NotEmpty List<UpdateTicketRequest> tickets,
                                 @NotNull UpdateLocationRequest location) {
}

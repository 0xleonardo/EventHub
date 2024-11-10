package hr.tvz.dreamteam.eventhub.web.event.update.event;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record PublishEventRequest(@NotNull UUID id) {
}

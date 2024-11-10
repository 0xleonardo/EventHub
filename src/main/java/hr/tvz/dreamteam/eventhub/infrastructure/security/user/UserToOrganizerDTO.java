package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record UserToOrganizerDTO(@NotNull UUID id) {
}

package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import jakarta.validation.constraints.NotNull;

public record PublicOrganizerProfileRequest(@NotNull String username) {
}

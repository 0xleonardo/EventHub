package hr.tvz.dreamteam.eventhub.infrastructure.security.domain;

import hr.tvz.dreamteam.eventhub.infrastructure.security.validation.email.NoDuplicateEmail;
import hr.tvz.dreamteam.eventhub.infrastructure.security.validation.email.ValidEmail;
import hr.tvz.dreamteam.eventhub.infrastructure.security.validation.username.NoDuplicateUsername;
import jakarta.validation.constraints.NotNull;

public record RegisterCommand(@NoDuplicateUsername @NotNull String username,
                              @NotNull String password,
                              @NotNull String firstName,
                              @NotNull String lastName,
                              @ValidEmail @NoDuplicateEmail @NotNull String email) {
}


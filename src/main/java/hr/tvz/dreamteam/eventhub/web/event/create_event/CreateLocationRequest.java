package hr.tvz.dreamteam.eventhub.web.event.create_event;

import jakarta.validation.constraints.NotNull;

public record CreateLocationRequest(@NotNull String address,
                                    @NotNull String city,
                                    @NotNull String state,
                                    @NotNull String country,
                                    @NotNull String zipCode) {
}

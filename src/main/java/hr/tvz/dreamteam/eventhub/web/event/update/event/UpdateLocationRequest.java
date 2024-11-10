package hr.tvz.dreamteam.eventhub.web.event.update.event;

import jakarta.validation.constraints.NotNull;

public record UpdateLocationRequest(@NotNull String address,
                                    @NotNull String city,
                                    @NotNull String state,
                                    @NotNull String country,
                                    @NotNull String zipCode) {
}

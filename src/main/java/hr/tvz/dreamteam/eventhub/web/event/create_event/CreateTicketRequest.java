package hr.tvz.dreamteam.eventhub.web.event.create_event;

import jakarta.validation.constraints.NotNull;

public record CreateTicketRequest(@NotNull String category,
                                  @NotNull double price,
                                  @NotNull Long amount) {
}

package hr.tvz.dreamteam.eventhub.web.event.update.event;

import jakarta.validation.constraints.NotNull;

public record UpdateTicketRequest(@NotNull String category,
                                  @NotNull double price,
                                  @NotNull Long amount,
                                  @NotNull Long amountToAdd,
                                  boolean readOnly) {
}

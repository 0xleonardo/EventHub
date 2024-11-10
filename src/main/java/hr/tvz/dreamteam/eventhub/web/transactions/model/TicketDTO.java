package hr.tvz.dreamteam.eventhub.web.transactions.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

import java.util.UUID;

@Value
@Setter
@Getter
@AllArgsConstructor
public class TicketDTO {

    UUID event_id;
    String category;
    double price;
    Long amount;

}

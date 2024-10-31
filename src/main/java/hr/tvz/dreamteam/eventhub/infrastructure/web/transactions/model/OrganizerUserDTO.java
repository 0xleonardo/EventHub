package hr.tvz.dreamteam.eventhub.infrastructure.web.transactions.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.Value;

import java.util.UUID;

@Value
@Setter
@Getter
@AllArgsConstructor
public class OrganizerUserDTO {

    UUID id;

    String username;

    String email;

    String about;

}

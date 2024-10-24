package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class AppUserDTO extends UserDTO {

    public AppUserDTO(UUID id, String username, String email, AuthorityType authorityType, LocalDateTime createdAt, String firstName, String lastName) {
        super(id, username, email, authorityType, createdAt);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @JsonProperty
    String firstName;

    @JsonProperty
    String lastName;

}

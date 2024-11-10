package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class OrganizerDTO extends UserDTO {

    @JsonProperty
    String about;

    @JsonProperty
    String imageUrl;

    public OrganizerDTO(UUID id, String username, String email, AuthorityType authorityType, LocalDateTime createdAt, String about, String imageUrl) {
        super(id, username, email, authorityType, createdAt);
        this.about = about;
        this.imageUrl = imageUrl;
    }


}

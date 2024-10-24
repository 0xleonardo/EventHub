package hr.tvz.dreamteam.eventhub.infrastructure.security.user;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@ToString
@EqualsAndHashCode
public abstract class UserDTO {

    UUID id;

    String username;

    String email;

    AuthorityType authority;

    LocalDateTime createdAt;

}
